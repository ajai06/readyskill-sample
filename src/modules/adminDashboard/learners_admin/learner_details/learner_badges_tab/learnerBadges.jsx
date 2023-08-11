import React, { useEffect } from 'react';
import { createTheme } from 'react-data-table-component';

import { useParams } from 'react-router-dom';

import { getLearnersOverviewDetails } from '../../../../../services/learnersServices';
import { useIsMounted } from '../../../../../utils/useIsMounted';
import { ConstText } from '../../../../../utils/constantTexts'

function LearnerBadges() {


  const { id } = useParams();
  // const [badges, setBadges] = useState([]);
  const isMounted = useIsMounted();

  useEffect(() => {
    getLearnersOverviewDetails(id)
      .then(res => {
        if (isMounted()) {
          // setBadges(res.data.badges.$values);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  createTheme('solarized', {
    text: {
      primary: '#9391b6',
      secondary: '#9391b6',

    },
    background: {
      default: '#181633',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#2f2c52',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');


  return (
    <div className="card-body">
      <div className="col-12 mt-3 overflow-auto max-h-500">
        <div className="col-5">
          <p className="inner-sub mt-1" style={{color:'white'}}> {ConstText.NODATA}</p>
        </div>
       
        {/* {
          badges && badges.map(badge => (
            <div className="row mb-3">
              <div className="col-3">
                <div className="d-flex mr-3">
                  <span className="material-icons badge-icons mr-3">{badge.icon}</span>
                  <p className="smallerText text-uppercase pb-0 mb-0 mt-1">{badge.name}</p>
                </div>
              </div>
              <div className="col-5">
                <p className="inner-sub mt-1">{badge.description}</p>
              </div>
              <div className="col-3">
                <p className="inner-sub mt-1">{(new Date(new Date(badge.assignedDate).getTime() - new Date(badge.assignedDate).getTimezoneOffset() * 60 * 1000)).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}</p>
              </div>
            </div>
          ))
        } */}
      </div>
    </div>
  )
}

export default LearnerBadges