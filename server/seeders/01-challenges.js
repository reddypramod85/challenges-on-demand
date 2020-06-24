"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("challenges", [
      {
        name: "The Redfish Challenge",
        notebook: "TheRedfishChallenge",
        description:
          "Your mission here will be to write the smallest possible program (in terms of number of Redfish API calls) that retrieves the complete Device Inventory list from an HPE iLO 5, and to display the following properties for each device: Location, Product Name, Firmware Version (if applicable) and Status. Remember, you only have so much time. Be quick and be sharp!",
        capacity: 39,
        preRequisite: "WKSHP-RedfishOverview, WKSHP-API101, WKSHP-GIT101",
        replayAvailable: true,
        active: false,
        videoUrl:
          "https://hpe.sharepoint.com/teams/HPE_TSS_2020/Presentations%20%20Recordings/Forms/AllItems.aspx?id=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud%2FHACK%5FSHACK%5FHS5%2DRedFish%20API101%2Emp4&parent=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "The container Challenge",
        notebook: "TheContainerChallenge",
        description:
          "This challenge is undoubtedly the most complicated one as it's an end-to-end developer experience. Your mission here will be to build a Grommet sample app (or reuse the one from the Grommet Challenge), package it in a container, and then run that container in a Kubernetes Cluster. This challenge touches on several technologies, such as front-end web application design, Docker containers and Kubernetes. Be ready for an intense moment when all the pieces of the puzzle will suddenly make total sense.",
        capacity: 20,
        preRequisite: "WKSHP-HPECP-API, WKSHP-API101, WKSHP-GIT101",
        replayAvailable: true,
        active: false,
        videoUrl:
          " https://hpe.sharepoint.com/teams/HPE_TSS_2020/Presentations%20%20Recordings/Forms/AllItems.aspx?id=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud%2FHACK%5FSHACK%5FHS4%2DLearn%20about%20fundamentals%20of%20HPE%20SimpliVity%20REST%20API%20and%20improve%20your%20agility%20in%20managing%20an%20HCI%20DC%2Emp4&parent=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "The HPE OneView Challenge",
        notebook: "TheOneViewChallenge",
        description:
          "Your mission, should you choose to accept it, is to implement vSphere VSAN on an HPE Synergy Composable Infrastructure. You will be asked to prepare a server profile template according to published best practices, and do it in a scripted way so that you can deploy it across your enterprise in different datacenters and different Synergy environments.",
        capacity: 40,
        preRequisite: "WKSHP-OneView, WKSHP-API101, WKSHP-GIT101",
        replayAvailable: true,
        active: false,
        videoUrl:
          " https://hpe.sharepoint.com/teams/HPE_TSS_2020/Presentations%20%20Recordings/Forms/AllItems.aspx?id=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud%2FHACK%5FSHACK%5FHS6%2DDive%20into%20infrastructure%20automation%20with%20the%20HPE%20OneView%20API%2Emp4&parent=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: "The Grommet Challenge",
        notebook: "TheGrommetChallenge",
        description:
          "A new mission awaits! In this challenge, you will take on a UX designer persona and show your creative side using Grommet to design your own little web app UI. You will start with the Grommet Designer, generate code from your design, push that code to GitHub, and finally deploy the app on Netlify. Beginner through expert designers and developers are all welcome. This challenge is all about unleashing your creativity!",
        capacity: 40,
        preRequisite: "WKSHP-GIT101",
        replayAvailable: true,
        active: false,
        videoUrl:
          "https://hpe.sharepoint.com/teams/HPE_TSS_2020/Presentations%20%20Recordings/Forms/AllItems.aspx?id=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud%2FHACK%5FSHACK%5FHS7%2DGrommet%2Emp4&parent=%2Fteams%2FHPE%5FTSS%5F2020%2FPresentations%20%20Recordings%2FSoftware%20Defined%20%26%20Cloud",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Workshops", null, {});
  }
};
