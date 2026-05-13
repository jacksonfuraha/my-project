import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Profile from './models/Profile.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Profile.deleteMany({});

    // Seed projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'Built a scalable microservices-based e-commerce backend handling 100k+ daily transactions with real-time inventory management.',
        tech: ['Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
        icon: '🛒',
        github: 'https://github.com',
        demo: 'https://demo.com',
        order: 1,
      },
      {
        title: 'Real-time Analytics Engine',
        description: 'Developed a high-performance analytics platform processing millions of events per day with sub-second query response times.',
        tech: ['Python', 'Apache Kafka', 'Elasticsearch', 'ClickHouse', 'Kubernetes'],
        icon: '📊',
        github: 'https://github.com',
        demo: 'https://demo.com',
        order: 2,
      },
      {
        title: 'API Gateway & Load Balancer',
        description: 'Engineered a custom API gateway with intelligent routing, rate limiting, and auto-scaling capabilities for microservices.',
        tech: ['Go', 'gRPC', 'Docker', 'Kubernetes', 'Linux'],
        icon: '🌐',
        github: 'https://github.com',
        demo: 'https://demo.com',
        order: 3,
      },
      {
        title: 'Payment Processing System',
        description: 'Designed secure payment processing system with PCI compliance, supporting multiple payment methods and currencies.',
        tech: ['Python', 'Django', 'PostgreSQL', 'Stripe API', 'OAuth2'],
        icon: '💳',
        github: 'https://github.com',
        demo: 'https://demo.com',
        order: 4,
      },
    ];

    await Project.insertMany(projects);
    console.log('✅ Projects seeded successfully');

    // Seed skills
    const skills = [
      { name: 'Node.js', category: 'Backend', proficiency: 'Expert', order: 1 },
      { name: 'Express.js', category: 'Backend', proficiency: 'Expert', order: 2 },
      { name: 'Python', category: 'Backend', proficiency: 'Advanced', order: 3 },
      { name: 'Django', category: 'Backend', proficiency: 'Advanced', order: 4 },
      { name: 'MongoDB', category: 'Database', proficiency: 'Expert', order: 1 },
      { name: 'PostgreSQL', category: 'Database', proficiency: 'Expert', order: 2 },
      { name: 'Redis', category: 'Database', proficiency: 'Advanced', order: 3 },
      { name: 'React', category: 'Frontend', proficiency: 'Advanced', order: 1 },
      { name: 'JavaScript', category: 'Languages', proficiency: 'Expert', order: 1 },
      { name: 'TypeScript', category: 'Languages', proficiency: 'Advanced', order: 2 },
      { name: 'Docker', category: 'DevOps', proficiency: 'Advanced', order: 1 },
      { name: 'Kubernetes', category: 'DevOps', proficiency: 'Intermediate', order: 2 },
      { name: 'Git', category: 'Tools', proficiency: 'Expert', order: 1 },
      { name: 'AWS', category: 'Tools', proficiency: 'Advanced', order: 2 },
    ];

    await Skill.insertMany(skills);
    console.log('✅ Skills seeded successfully');

    // Seed profile
    const profile = {
      name: 'Full Stack Backend Developer',
      title: 'Backend Developer',
      bio: 'I\'m a passionate full-stack backend developer with 5+ years of experience building scalable web applications and enterprise solutions.',
      yearsExperience: 5,
      projectsCompleted: 50,
      clientsServed: 30,
    };

    await Profile.create(profile);
    console.log('✅ Profile seeded successfully');

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
