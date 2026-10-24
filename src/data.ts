export type Category = 'Computational Biology' | 'Software Engineering' | 'Mathematics & Algorithms' | 'Quantitative Research' | 'Ventures & Strategy' | 'Creative Work'

export type Project = {
  id: string; title: string; category: Category; date: string; tools: string; description: string; detail: string
}

export const projects: Project[] = [
  { id: 'EXP—001', title: "Alzheimer's Detection from EEG Signals", category: 'Computational Biology', date: 'Summer 2026', tools: 'Python · Signal Processing · SVM', description: 'Reading structure in alpha-band neural signals.', detail: 'Extracted epoch-based entropy and wavelet-derived synchrony features across brain regions and frequency bands. OFR feature selection and polynomial SVM classification reported 91.6% accuracy, 100% specificity, and 87.8% sensitivity for distinguishing Alzheimer’s disease from subjective cognitive impairment. These are reported research results, not clinical validation.' },
  { id: 'EXP—002', title: 'Computational Irrigation Systems', category: 'Computational Biology', date: '2025—Present', tools: 'Sensors · Penman–Monteith · Systems Design', description: 'Designing resilient water systems for a local food desert.', detail: 'With Project BLUELab: Metro, researched Penman–Monteith irrigation approaches, soil-moisture sensing, hardware, reliability, and budget constraints for a nonprofit farm. Also planned an interactive weather-education site for Willow Run Acres.' },
  { id: 'EXP—003', title: 'Stock Market Simulation', category: 'Mathematics & Algorithms', date: 'Spring 2026', tools: 'C++ · Priority Queues · Streaming Algorithms', description: 'A single-pass market engine built for algorithmic clarity.', detail: 'Developed a stream-based stock market simulation with priority queues, custom comparators, running medians, and single-pass algorithms for identifying optimal buy-and-sell intervals.' },
  { id: 'EXP—004', title: 'Predictive Modeling of Coffee Futures', category: 'Quantitative Research', date: '2026—Present', tools: 'Python · C++ · Excel', description: 'Studying the signals behind a volatile commodity.', detail: 'At Bond Consulting Group, analyzed more than ten years of coffee C futures pricing data and developed predictive modeling approaches for pricing and risk management to support strategic purchasing decisions. No backtesting statistics or forecasts are presented here.' },
  { id: 'EXP—005', title: 'Scientific Visualization & Biological Research', category: 'Creative Work', date: '2023—2024', tools: '3D Illustration · Wet Lab Workflows', description: 'Making complex research legible without making it ordinary.', detail: 'At Li Laboratory, developed 3D scientific illustrations for work involving micro-robotics, biosensors, soft-tissue electrodes, drones, and neurotechnology. Supported microbial DNA extraction and bacterial cultivation workflows.' },
]

export const experience = [
  ['01', 'Bond Consulting Group', 'Consultant', 'JAN 2026—PRESENT', 'Quantitative forecasting, business analysis, financial modeling, and technology strategy.'],
  ['02', 'Project BLUELab: Metro', 'Software Engineer', 'AUG 2025—PRESENT', 'Sustainable engineering, smart irrigation, environmental models, and educational software.'],
  ['03', 'UpRound Venture Capital', 'Accelerator Analyst', 'AUG 2025—PRESENT', 'Startup evaluation, competitive research, market strategy, and venture analysis.'],
  ['04', 'Traders at Michigan', 'Quantitative Trader', '2025—PRESENT', 'Trading education, computational tools, and simulated trading competitions.'],
  ['05', 'Li Laboratory', 'Researcher', '2023—2024', 'Scientific visualization, biological research workflows, and interdisciplinary collaboration.'],
] as const
