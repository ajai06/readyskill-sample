import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function GenderChart() {
    let Gender = [
        { name: 'FEMALE', value: 53 },
        { name: 'MALE', value: 40 },
        { name: 'PREFER NOT TO ANSWER', value: 7 },

    ];
    let COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (<div className='col-6 mb-3'>
        <div className='card demo-card'>
            <div className='card-body'>
                <div className='row'>
                    <div className='col-6 graph'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart width={200} height={200}>
                                <Pie
                                    data={Gender}
                                    cx={80}
                                    cy={120}
                                    innerRadius={60}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    paddingAngle={0}
                                    dataKey="value"
                                >
                                    {Gender.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='col-6 pt-5'>
                        <div className='d-flex'>
                            <span className="impact-dots dot-1 mr-2"></span>
                            <p className='subText-bold'>FEMALE</p>
                            <p className='subText ml-auto pl-2'>53%</p>
                        </div>
                        <div className='d-flex'>
                            <span className="impact-dots dot-2 mr-2"></span>
                            <p className='subText-bold'>MALE</p>
                            <p className='subText ml-auto pl-2'>40%</p>
                        </div>
                        <div className='d-flex'>
                            <span className="impact-dots dot-3 mr-2"></span>
                            <p className='subText-bold'>PREFER NOT TO ANSWER</p>
                            <p className='subText ml-auto pl-2'>7%</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>)
}

export default GenderChart;
