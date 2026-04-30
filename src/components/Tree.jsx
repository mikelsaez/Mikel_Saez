import React, { useState, useEffect } from 'react';
import './Tree.css';

export default function Tree() {
  const [animState, setAnimState] = useState('idle'); // 'idle', 'wobble', 'grow'
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        // Limit between 0 and 1
        const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (animState === 'idle') {
      setAnimState('wobble');
    }
  };

  const handleTreeAnimationEnd = (e) => {
    // Only trigger if it's the main tree SVG animating
    if (e.target.id === 'exampleTree' || e.target.closest('#exampleTree') === e.target) {
      if (e.animationName === 'wobble') {
        setAnimState('grow');
      }
    }
  };

  const handleLeafAnimationEnd = (e) => {
    // When a leaf finishes growing, reset state
    if (e.animationName === 'grow' || e.animationName === 'fadeIn') {
      setAnimState('idle');
    }
  };

  const treeClass = `animatedElement tree-container ${animState !== 'idle' ? animState : ''}`;

  // Base visibility 25% (so the bottom of the stem and bottom leaves are visible)
  const minProgress = 0.25;
  const currentProgress = minProgress + (scrollProgress * (1 - minProgress));
  
  // Total viewBox height is 226.796
  const clipHeight = 226.796 * currentProgress;
  const clipY = 226.796 - clipHeight;

  // Helper to organically scale leaves as the stem reaches them
  const getLeafStyle = (leafY) => {
    const isVisible = clipY < leafY;
    return {
      transform: isVisible ? 'scale(1)' : 'scale(0)',
      opacity: isVisible ? 1 : 0,
      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease'
    };
  };

  return (
    <div className="tree-wrapper">
      <svg 
        id="exampleTree" 
        className={treeClass} 
        onMouseEnter={handleMouseEnter}
        onAnimationEnd={handleTreeAnimationEnd}
        xmlns="http://www.w3.org/2000/svg" 
        width="154" 
        height="400" 
        viewBox="0 0 87.363 226.796"
      >
        <defs>
          <clipPath id="tree-growth-clip">
            <rect x="-20" y={clipY} width="120" height={clipHeight + 20} style={{ transition: 'y 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }} />
          </clipPath>
        </defs>
        
        {/* Only clip the main stem so it grows upwards naturally */}
        <polygon clipPath="url(#tree-growth-clip)" className="animatedElement stem" fill="currentColor" points="57.834,-0.027 59.834,211.453 55.551,211.453 55.841,-0.027 "></polygon>

        {/* Leaves will pop in organically as the stem grows past them */}
        <path style={getLeafStyle(27)} className="animatedElement rightLeaf" fill="currentColor" onAnimationEnd={handleLeafAnimationEnd} d="M55.896,27.761c5.196,5.197,13.803,5.206,19.221,0.027l8.351-8.354c-5.198-5.199-13.8-5.211-19.215-0.033 L55.896,27.761z"></path>
        <path style={getLeafStyle(70)} className="animatedElement leftLeaf" fill="currentColor" d="M41.491,62.769c-1.865,5.039,0.758,10.76,5.854,12.778l8.101,2.997c1.866-5.041-0.753-10.761-5.848-12.776 L41.491,62.769z"></path>
        <path style={getLeafStyle(97)} className="animatedElement rightLeaf" fill="currentColor" d="M56.192,97.282c7.755,2.871,16.558-1.166,19.662-9.006l4.611-12.465c-7.758-2.871-16.557,1.159-19.659,8.997 L56.192,97.282z"></path>
        <path style={getLeafStyle(140)} className="animatedElement leftLeaf" fill="currentColor" d="M32.657,130.543c-2.242,7.959,2.485,16.412,10.549,18.88l12.793,3.6c2.242-7.962-2.478-16.411-10.54-18.876 L32.657,130.543z"></path>
        <path style={getLeafStyle(181)} className="animatedElement rightLeaf" fill="currentColor" d="M56.208,181.236c7.884,2.496,16.482-1.96,19.208-9.939l4.007-12.671c-7.887-2.496-16.482,1.951-19.204,9.93 L56.208,181.236z"></path>
        <path style={getLeafStyle(125)} className="animatedElement leftLeaf" fill="currentColor" d="M56.248,121.693c-4.714,1.19-9.972-3.177-11.743-9.746l-2.623-10.398c4.717-1.189,9.971,3.171,11.742,9.739 L56.248,121.693z"></path>
        <path style={getLeafStyle(125)} className="animatedElement rightLeaf" fill="currentColor" d="M69.836,123.584c-0.815-3.891-4.711-6.44-8.696-5.698l-6.252,1.313c0.816,3.892,4.707,6.442,8.691,5.699 L69.836,123.584z"></path>
        <path style={getLeafStyle(15)} className="animatedElement leftLeaf" fill="currentColor" d="M43.469,6.638c-1.896,5.12,0.771,10.932,5.945,12.981l8.23,3.044c1.896-5.122-0.766-10.932-5.94-12.979 L43.469,6.638z"></path>

        <g style={getLeafStyle(55)} className="branch topBranch">
            <path className="animatedElement rightLeaf" fill="currentColor" d="M42.905,44.615c2.944,0.141,5.503-2.179,5.715-5.178l0.227-4.734c-2.946-0.141-5.505,2.175-5.715,5.174 L42.905,44.615z"></path>
            <polygon className="animatedElement leftLeaf" fill="currentColor" points="56.989,53.146 37.434,37.722 35.142,39.649 56.989,59.66 "></polygon>
        </g>

        <g style={getLeafStyle(110)} className="branch bottomBranch">
            <path className="animatedElement rightLeaf" fill="currentColor" d="M80.116,97.661c-2.798,0.926-4.352,4.011-3.471,6.886l1.49,4.498c2.801-0.927,4.354-4.008,3.473-6.884 L80.116,97.661z"></path>
            <path className="animatedElement rightLeaf" fill="currentColor" d="M68.935,104.905c0.189,2.941,2.78,5.225,5.784,5.101l4.73-0.305c-0.189-2.943-2.778-5.227-5.782-5.1 L68.935,104.905z"></path>
            <polygon className="animatedElement rightLeaf" fill="currentColor" points="85.193,104.596 56.991,116.624 58.122,119.396 86.735,106.256 "></polygon>
        </g>
      </svg>
    </div>
  );
}
