import React from "react";


export function Card({
  cardData,
  currentActiveId,
  setCurrentExternalConnection,
}) {



  return (
    <div
    style={{
      display: "inline-block",
      userSelect: "none"
    }}
      className={`card ${
        currentActiveId === cardData.id
          ? "active-connection-card "
          : "connection-card "
      }`}
      onClick={() => setCurrentExternalConnection(cardData)}
    >
      <div className="card-body cursor-pointer"> 
        <div className="d-flex">
          <p className="connection-name">{cardData.connectionName}</p>
          {cardData.swaggerSupport && (
            <span className="material-icons list-fun-btns mr-3 ml-auto text-success">
              check_circle
            </span>
          )}
        </div>
        <p>{cardData.description}</p>
      </div>
    </div>
  );
}
