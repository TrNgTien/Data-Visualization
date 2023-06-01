import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">Project Data Science and Data Visualization</li>
        <li className="sidebar-menu-item">Visualize data of FIFA Player</li>
        <li className="sidebar-menu-item">With 3 charts below</li>
      </ul>
      {/* <ul className="sidebar-menu">
        <li className="sidebar-menu-item">Le Nguyen Binh Nguyen</li>
        <li className="sidebar-menu-item">ITITIU19169</li>
      </ul> */}
    </div>
  );
};

export default Sidebar;
