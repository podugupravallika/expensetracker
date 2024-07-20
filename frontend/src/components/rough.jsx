import { motion } from "framer-motion";
import { useState } from "react";

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
};

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      className="bg-gray-100 dark:bg-gray-900"
    >
      <Toggle onClick={() => setIsOpen(!isOpen)} />
      <Items />
    </motion.nav>
  );
};

const Toggle = ({ onClick }) => (
  <button onClick={onClick} className="p-2 text-red-600 bg-blue-500 rounded">
    Toggle
  </button>
);

const Items = () => (
  <ul className="list-none p-0 m-0">
    <li className="p-2 border-b">Item 1</li>
    <li className="p-2 border-b">Item 2</li>
    <li className="p-2 border-b">Item 3</li>
  </ul>
);

export default MyComponent;
