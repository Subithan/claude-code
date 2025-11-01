import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8"
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 flex items-center gap-2"
          >
            Made with <FaHeart className="text-pink-500 animate-pulse" /> by Claude
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-6"
          >
            {[
              { icon: FaGithub, href: '#' },
              { icon: FaTwitter, href: '#' },
              { icon: FaLinkedin, href: '#' },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          © {new Date().getFullYear()} All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
