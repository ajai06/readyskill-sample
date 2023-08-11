import React from 'react'
import { ConstText } from '../../utils/constantTexts'

function SpiderChart({chartData,headerText}) {
    return (
        <div className="col-xl-12 col-lg-12 col-md-12 pb-3">
            <div className="card shadow strengths-card">
              <div className="card-body">
                <div className='d-flex'>
                <p className="subHead-text mb-3">{headerText}</p>
                <span className="material-icons ml-3 mt-1 info-icon">info</span>
                </div>
                <div className="text-6 py-3 w-100 text-center" style={{ color: 'white' }}>{ConstText.NODATA}</div>
                {/* <RadarChart height={285} width={350}
                  outerRadius="70%" data={chartData} >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" fontSize={12} tickLine={false} stroke="#FFFFFF" />
                  <Radar
                    r={5}
                    dataKey="x"
                    dot
                    stroke="#01DBCF"
                    fill="rgb(19,55,77)"
                    fillOpacity={0.5} />
                </RadarChart> */}
              </div>
            </div>
          </div>
    )
}

export default SpiderChart
