import fs from 'fs';
import path from 'path';
import Project from '../models/projectModel.js';
import ValidationReport from '../models/validationReportModel.js';
import CrossQA from '../models/crossQAModel.js';
import BrandKit from '../models/brandKitModel.js';
import Website from '../models/websiteModel.js';
import User from '../models/userModel.js';
import { researchIdea, generateReport } from '../services/validationService.js';
import { generateLogoOptions, generateComplementaryBrandData, generateBusinessCardPdf } from '../services/brandKitService.js';
import { generateWebsiteHtml } from '../services/websiteService.js';
import { saveFilesLocally } from '../services/fileService.js';
import { getSmartDomainSuggestions } from '../services/domainService.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =================================================================
// UNCHANGED FUNCTIONS
// =================================================================

export const getProjectsForUser = async (req, res) => {
  try {
    const projects = await Project.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user_id: req.user.id
    })
      .populate('validation_report_id')
      .populate('brand_kit_id')
      .populate('website_id');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const overrideVerdict = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.verdict_overridden = true;
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error('Error overriding verdict:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createProject = async (req, res) => {
  const { title, pitch, problem, target_user, channels, monetization } = req.body;
  if (!title || !pitch) return res.status(400).json({ message: 'Title and Pitch are required.' });
  try {
    const newProject = await Project.create({ title, pitch, problem, target_user, channels, monetization, user_id: req.user.id });
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const validateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const researchResults = await researchIdea(`market analysis and competitors for a startup doing: ${project.pitch}`);
    const reportData = await generateReport(project, researchResults);
    const newReport = await ValidationReport.create({ project_id: project._id, ...reportData });
    project.validation_report_id = newReport._id;
    project.status = 'validated';
    await project.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Validation process failed:', error);
    res.status(500).json({ message: 'Failed to validate project.' });
  }
};

export const saveCrossQA = async (req, res) => {
  const { question, answer } = req.body;
  const { id: projectId } = req.params;
  if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required.' });
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const newQA = await CrossQA.create({ project_id: projectId, question, answer });
    project.cross_qa_ids.push(newQA._id);
    await project.save();
    res.status(201).json(newQA);
  } catch (error) {
    console.error('Error saving CrossQA:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getDomainSuggestions = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    const availableDomains = await getSmartDomainSuggestions(project, req.user.id);
    res.status(200).json(availableDomains);
  } catch (error) {
    console.error('Error in getDomainSuggestions controller:', error);
    res.status(500).json({ message: 'Failed to get domain suggestions.' });
  }
};

export const selectDomain = async (req, res) => {
  const { domainName } = req.body;
  const { id: projectId } = req.params;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { selected_domain_name: domainName, status: 'domain_selected' },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.status(200).json({ message: `Domain '${domainName}' selected successfully.`, project });
  } catch (error) {
    console.error('Error in selectDomain:', error);
    res.status(500).json({ message: 'Failed to select domain.' });
  }
};

/**
 * @description Controller for STEP 1 of Brand Identity: Fetch image logo options.
 */
export const getLogoOptions = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const logoOptions = await generateLogoOptions(project);
    res.status(200).json(logoOptions);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate logo options.' });
  }
};

// =================================================================
// UPDATED FUNCTIONS START HERE
// =================================================================

/**
 * @description Controller for STEP 2 & 3 of Brand Identity: Generate final kit from chosen logo URL.
 */
export const generateBrandKit = async (req, res) => {
  // --- FIX #1: Expect 'chosenLogoUrl' from the frontend ---
  const { chosenLogoUrl } = req.body;
  if (!chosenLogoUrl) {
    return res.status(400).json({ message: 'A chosen logo URL must be provided.' });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // --- FIX #2: Pass the URL to the service ---
    const complementaryData = await generateComplementaryBrandData(chosenLogoUrl);

    // Create a final, clean object to pass to other services and to save
    const brandData = {
      ...complementaryData, // This has palette and fonts
      logoUrl: chosenLogoUrl
    };
    
    const businessCardPdf = await generateBusinessCardPdf(brandData, user, project);

    const projectDir = path.join(__dirname, '..', 'public', 'uploads', project._id.toString());
    if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });

    const cardFileName = 'business-card.pdf';
    fs.writeFileSync(path.join(projectDir, cardFileName), businessCardPdf);
    const businessCardUrl = `/uploads/${project._id}/${cardFileName}`;

    // --- FIX #3: Save `logoUrl` to the database, NOT `logoSvg` ---
    const newBrandKit = await BrandKit.create({
      project_id: project._id,
      palette: brandData.palette,
      fonts: brandData.fonts,
      logoUrl: brandData.logoUrl, // This assumes your BrandKit model is updated
      businessCardUrl: businessCardUrl,
    });

    project.brand_kit_id = newBrandKit._id;
    project.status = 'brand_kit_generated';
    await project.save();
    res.status(201).json(newBrandKit);
  } catch (error) {
    console.error("Error in generateBrandKit controller:", error);
    res.status(500).json({ message: 'Failed to generate the brand kit.' });
  }
};

export const generateWebsite = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('brand_kit_id')
      .populate('cross_qa_ids');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.brand_kit_id) return res.status(400).json({ message: 'Brand kit must be generated first.' });

    const htmlContent = await generateWebsiteHtml(project, project.brand_kit_id, project.cross_qa_ids, req.user.id);
    
    // --- FIX #4: `saveFilesLocally` no longer handles logos, just HTML ---
    const filesToSave = {
      htmlContent,
    };
    const { zipUrl } = await saveFilesLocally(project._id, filesToSave);

    // --- FIX #5: Save the correct logo URL from the BrandKit to the Website document ---
    const newWebsite = await Website.create({
      project_id: project._id,
      zipUrl,
      logoUrl: project.brand_kit_id.logoUrl,
    });

    project.website_id = newWebsite._id;
    project.status = 'website_generated';
    await project.save();
    res.status(201).json(newWebsite);
  } catch (error) {
    console.error('Error in generateWebsite controller:', error);
    res.status(500).json({ message: 'Failed to generate website.' });
  }
};