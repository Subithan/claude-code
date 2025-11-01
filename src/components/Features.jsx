import { motion } from 'framer-motion';
import {
  FaLightbulb,
  FaRocket,
  FaShieldAlt,
  FaBolt,
  FaPalette,
  FaCode,
  FaMobile,
  FaChartLine,
  FaCog
} from 'react-icons/fa';

const features = [
  {
    icon: FaLightbulb,
    title: 'Innovative Design',
    description: 'Cutting-edge designs that push the boundaries of creativity',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: FaBolt,
    title: 'Lightning Fast',
    description: 'Optimized performance for instant loading and smooth interactions',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security to protect your data',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FaPalette,
    title: 'Beautiful UI',
    description: 'Stunning interfaces that users love to interact with',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: FaCode,
    title: 'Clean Code',
    description: 'Well-structured, maintainable code following best practices',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: FaMobile,
    title: 'Responsive',
    description: 'Perfect experience across all devices and screen sizes',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: FaChartLine,
    title: 'Analytics',
    description: 'Deep insights to understand your users better',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: FaCog,
    title: 'Customizable',
    description: 'Flexible configuration to match your exact needs',
    color: 'from-gray-500 to-slate-500',
  },
  {
    icon: FaRocket,
    title: 'Scalable',
    description: 'Built to grow with your business from day one',
    color: 'from-violet-500 to-purple-500',
  },
];

const Features = () => {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to create exceptional digital experiences
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="group relative glass p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`relative w-14 h-14 mb-4 rounded-lg bg-gradient-to-br ${feature.color} p-3 shadow-lg`}
              >
                <feature.icon className="w-full h-full text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
