/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';

import SearchInput from '../../components/SearchInput';
import FilterContext from '../../contexts/FilterContext';
import UserContext from '../../contexts/UserContext';
import MessageContext from '../../contexts/MessageContext';
import ListSelect from '../../components/ListSelect';

const ProspectsDrawer = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { filterContext, campaignContext } = useContext(FilterContext);
  const [, setMessage] = useContext(MessageContext);

  const [filter, setFilter] = filterContext;
  const [, setSelectedCampaign] = campaignContext;
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (user) {
      fetch('/user/campaigns_list', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((d) => {
          const returnedCampaigns = [];
          d.response.forEach((c) => {
            const campaign = { _id: c._id, name: c.name };
            returnedCampaigns.push(campaign);
          });
          setCampaigns(returnedCampaigns);
        })
        .catch((err) =>
          setMessage({ type: 'error', text: `There was a problem fetching the campaigns: ${err}` })
        );
    }
  }, [user]);
  return (
    <>
      <SearchInput search={filter} setSearch={setFilter} />
      <ListSelect
        ariaLabel="campaign select options"
        listItemText={campaigns.map((c) => c.name)}
        listType="campaign"
        selectItem={(index) => setSelectedCampaign(campaigns[index])}
        listHeader="Campaigns"
        isBold={false}
      />
    </>
  );
};

export default ProspectsDrawer;
