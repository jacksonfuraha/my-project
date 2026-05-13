export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Built a scalable microservices-based e-commerce backend handling 100k+ daily transactions with real-time inventory management.',
      tech: ['Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
      icon: '🛒',
      github: '#',
      demo: '#',
    },
    {
      title: 'Real-time Analytics Engine',
      description: 'Developed a high-performance analytics platform processing millions of events per day with sub-second query response times.',
      tech: ['Python', 'Apache Kafka', 'Elasticsearch', 'ClickHouse', 'Kubernetes'],
      icon: '📊',
      github: '#',
      demo: '#',
    },
    {
      title: 'API Gateway & Load Balancer',
      description: 'Engineered a custom API gateway with intelligent routing, rate limiting, and auto-scaling capabilities for microservices.',
      tech: ['Go', 'gRPC', 'Docker', 'Kubernetes', 'Linux'],
      icon: '🌐',
      github: '#',
      demo: '#',
    },
    {
      title: 'Payment Processing System',
      description: 'Designed secure payment processing system with PCI compliance, supporting multiple payment methods and currencies.',
      tech: ['Python', 'Django', 'PostgreSQL', 'Stripe API', 'OAuth2'],
      icon: '💳',
      github: '#',
      demo: '#',
    },
    {
      title: 'Data Pipeline & ETL',
      description: 'Created robust ETL pipeline for processing and transforming large datasets with automated error handling and monitoring.',
      tech: ['Python', 'Apache Airflow', 'PostgreSQL', 'AWS S3', 'Spark'],
      icon: '🔄',
      github: '#',
      demo: '#',
    },
    {
      title: 'Notification Service',
      description: 'Built distributed notification service supporting email, SMS, and push notifications with retry logic and queuing.',
      tech: ['Node.js', 'RabbitMQ', 'MongoDB', 'Redis', 'Twilio'],
      icon: '🔔',
      github: '#',
      demo: '#',
    },
  ];

  return (
    <section className="pt-32 pb-20 bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Showcasing some of my recent work and achievements</p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition duration-300 transform hover:-translate-y-2"
            >
              {/* Project Icon */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-center">
                <div className="text-5xl">{project.icon}</div>
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4 pt-6">
                  <a
                    href={project.github}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-center text-sm font-semibold transition duration-300"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.demo}
                    className="flex-1 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 py-2 rounded text-center text-sm font-semibold transition duration-300"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects */}
        <div className="text-center mt-12">
          <button className="w-full max-w-xs mx-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
}
