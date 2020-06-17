const getDates = () => {
  const startDate = new Date();
  const endDate = new Date();
  //start.setDate(start.getDate() - 9 + key);
  endDate.setHours(endDate.getHours() + 4);
  return { startDate, endDate };
};
module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      "customers",
      [
        {
          name: "Patrick",
          email: "patrick.francois@hpe.com",
          company: "HPE",
          // workshopList: ["RedFish API101", "HPE OneView API"],
          ...getDates(),
          challenge: "The Redfish Challenge",
          hours: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Fred",
          email: "frederic.passeron@hpe.com",
          company: "HPE",
          ...getDates(),
          challenge: "The HPE OneView Challenge",
          hours: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Didier",
          email: "didier.lalli@hpe.com",
          company: "HPE",
          ...getDates(),
          challenge: "The container Challenge",
          hours: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "pramod sareddy",
          email: "pramod-reddy.sareddy@hpe.com",
          company: "HPE",
          // workshopList: [
          //   "Discover Grommet an HPE Open Source project to develop apps"
          // ],
          ...getDates(),
          challenge: "The Grommet Challenge",
          hours: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {
        returning: true
      }
    ),

  down: queryInterface => queryInterface.bulkDelete("customers", null, {})
};
