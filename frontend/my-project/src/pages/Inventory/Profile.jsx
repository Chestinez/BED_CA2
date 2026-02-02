import React from "react";
import { useAuth } from "../../hooks/useAuth";
import ShipAssembly from "../../components/InventoryScene/ShipAssembly";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
export default function Profile() {
  const { user } = useAuth();
  const profileData = user
    ? JSON.parse(localStorage.getItem("userData"))[0]
    : null;
  return (
    <>
      <PageLoadWrap>
        <div>Profile Page</div>
        {profileData && (
          <div>
            <h2>Username: {profileData.username}</h2>
            <h3>Rank: {profileData.rank} </h3>
            <h4>Points: {profileData.points}</h4>
            <h4>Credits: {profileData.credits}</h4>
            <h4>created_at: {profileData.account_age}</h4>
            <h4>Missions Completed: {profileData.missions_completed}</h4>
            <h4>Missions Pending: {profileData.missions_pending}</h4>
            <h4>Missions Total: {profileData.missions_total}</h4>
            <ShipAssembly profileData={profileData} />
          </div>
        )}
      </PageLoadWrap>
    </>
  );
}
