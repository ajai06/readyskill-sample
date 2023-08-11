import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function EmploymentChart() {
    let data = [
        { name: 'EMPLOYED', value: 82 },
        { name: 'JOB HUNTING', value: 8 },
        { name: 'EMPLOYED IN OTHER OCCUPATION', value: 7 },
        { name: 'UNEMPLOYED', value: 3 },
    ];
    
    let COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (<div className='col-6 mb-3'>
        <div className='card demo-card'>
            <div className='card-body'>
                {/* employement rate */}

                <div className='card-body'>
                    <div className='row'>
                        <div className='col-6 graph'>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart width={200} height={200}>
                                    <Pie
                                        data={data}
                                        cx={80}
                                        cy={120}
                                        innerRadius={60}
                                        outerRadius={70}
                                        fill="#8884d8"
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <span className="impact-dots dot-1 mr-2"></span>
                                <p className='subText-bold'>EMPLOYED</p>
                                <p className='subText ml-auto pl-2'>82%</p>
                            </div>
                            <div className='d-flex'>
                                <span className="impact-dots dot-2 mr-2"></span>
                                <p className='subText-bold'>JOB HUNTING</p>
                                <p className='subText ml-auto pl-2'>8%</p>
                            </div>
                            <div className='d-flex'>
                                <span className="impact-dots dot-3 mr-2"></span>
                                <p className='subText-bold'>EMPLOYED IN OTHER OCCUPATION</p>
                                <p className='subText ml-auto pl-2'>7%</p>
                            </div>
                            <div className='d-flex'>
                                <span className="impact-dots dot-4 mr-2"></span>
                                <p className='subText-bold'>UNEMPLOYED</p>
                                <p className='subText ml-auto pl-2'>3%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default EmploymentChart;
