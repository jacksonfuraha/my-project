export default function Skills() {
  const skillCategories = [
    {
      category: 'Backend Languages',
      skills: ['Python', 'JavaScript/Node.js', 'Java', 'Go', 'C++'],
    },
    {
      category: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch'],
    },
    {
      category: 'Cloud & DevOps',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    },
    {
      category: 'Frameworks & Tools',
      skills: ['Express.js', 'Django', 'Spring Boot', 'RESTful APIs', 'GraphQL'],
    },
    {
      category: 'Architecture',
      skills: ['Microservices', 'System Design', 'Scalability', 'Performance Tuning', 'SOLID Principles'],
    },
    {
      category: 'Other',
      skills: ['Git', 'Linux', 'Testing', 'Agile', 'Project Management'],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <h3 className="text-xl font-bold text-blue-400 mb-6">{category.category}</h3>
              <div className="space-y-3">
                {category.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Proficiency Bars */}
        <div className="mt-16 space-y-8">
          <h3 className="text-2xl font-bold mb-8 text-center">Proficiency Levels</h3>

          {[
            { language: 'Python', level: 95 },
            { language: 'JavaScript/Node.js', level: 90 },
            { language: 'Database Design', level: 92 },
            { language: 'Cloud Architecture', level: 88 },
            { language: 'System Design', level: 85 },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-300">{item.language}</span>
                <span className="text-blue-400 font-bold">{item.level}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition duration-1000"
                  style={{ width: `${item.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
