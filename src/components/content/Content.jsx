import { useCallback, useState } from 'react';
import './Content.css';
import { ScatterPlotChart } from './ScatterPlotChart';
import { BarChart } from './barchart/BarChart';
import { GeoChart } from './geochart/GeoChart';

//----------------------------Rendering------------------------------------------------------
export const Content = () => {
  const [type, setType] = useState('barChart')

  //--------------------------------------------------------------------
  const changeChart = useCallback((type) => {
    setType(type)
  }, [type])

  //--------------------------------------------------------------------
  const RenderChart = useCallback(() => {
    switch (type) {
      case 'scatterChart': {
        return <ScatterPlotChart />
      }
      case 'geoChart': {
        return <GeoChart />
      }
      default: {
        return <BarChart />
      }
    }
  }, [type])

  return (
    <div className="content">
      <div className='chart-title'>
        <h1>Project Data Science and Visualization</h1>
      </div>
      <div style={{ display: 'flex', marginTop: '2rem' }}>
        <div className='button-container'>
          <button style={{ cursor: 'pointer' }} onClick={() => changeChart('barChart')}>BAR CHART</button>
          <button style={{ cursor: 'pointer' }} onClick={() => changeChart('scatterChart')}>SCATTER PLOT CHART</button>
          <button style={{ cursor: 'pointer' }} onClick={() => changeChart('geoChart')}>GEO CHART</button>
        </div>
        <div className='interactive-view'>
          <RenderChart />
        </div>
      </div>
    </div>
  );
};

