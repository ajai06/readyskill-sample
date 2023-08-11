import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import GlobalAdminLayOut from "../../../../sharedComponents/hoc/globalAdminLayOut";
import DashboardHeaderComponent from "../../../../sharedComponents/dashboardHeader/dashboardHeaderComponent";

import "../platformAdmin.scss";
import { Card } from "./card";
import ExternalConnectionForm from "./externalConnectionForm";

import Slider from "react-slick";
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

//context
import { useIsMounted } from "../../../../utils/useIsMounted";
import { getAllExternalConnections } from "../../../../services/adminServices";

function ExternalConnections() {
  const [currentExternalConnection, setCurrentExternalConnection] =
    useState(undefined);
  const [externalConnectionList, setExternalConnectionList] = useState([]);
  const isMounted = useIsMounted();

  useEffect(() => {
    getAllExternalConnectionsList();
  }, []);
  function onWheel(apiObj, ev) {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }

  const getAllExternalConnectionsList = () => {
    getAllExternalConnections()
      .then((res) => {
        if (isMounted()) {
          setExternalConnectionList(res.data.$values);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const settings = {
    dots: false,
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
  };
  
  

  return (
    <>
      <div id="main" className="external-connetions">
        <DashboardHeaderComponent headerText="ReadySkill Administrator" />
        <div className="bread-crumb-assesment">
          <NavLink
            to="/portal/admin/platform_admins"
            className="smallText text-uppercase text-decoration-none navlink"
          >
            READYSKILL ADMINISTRATOR{" "}
          </NavLink>
          <a className="smallText text-uppercase navlink-assesment text-decoration-none">
            {" "}
            {">"} EXTERNAL CONNECTIONS
          </a>
        </div>
        <div className="container-fluid">
          <h1 className="h5 headText mt-5 d-flex mb-3">
            <span className="material-icons mt-02 mr-2">hub</span>
            External Connections
          </h1>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-5 pr-2">
              <div className="card shadow group-manage-card pt-3">
                <div className="card-body px-5">

                  {/* new package */}
                  {externalConnectionList.length > 0 ? (
                    <Slider {...settings}>
                      {" "}
                      {externalConnectionList.map((item, index) => (
                        <Card
                          cardData={item} // NOTE: itemId is required for track items
                          key={index}
                          setCurrentExternalConnection={
                            setCurrentExternalConnection
                          }
                          currentActiveId={currentExternalConnection?.id}
                        />
                      ))}
                    </Slider>
                  ) : (
                    <div className="text-white text-center">
                      No records found
                    </div>
                  )}
                  {currentExternalConnection && (
                    <ExternalConnectionForm
                      currentExternalConnection={currentExternalConnection}
                      getAllExternalConnectionsList={
                        getAllExternalConnectionsList
                      }
                      setCurrentExternalConnection={
                        setCurrentExternalConnection
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalAdminLayOut(ExternalConnections);


