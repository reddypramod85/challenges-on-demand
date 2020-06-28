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
          email: "patrick@hpe.com",
          company: "HPE",
          ...getDates(),
          challenge: "The Redfish Challenge",
          notebook: "TheRedfishChallenge",
          hours: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Fred",
          email: "frederic@hpe.com",
          company: "HPE",
          ...getDates(),
          challenge: "The HPE OneView Challenge",
          notebook: "TheOneViewChallenge",
          hours: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Didier",
          email: "didier@hpe.com",
          company: "HPE",
          ...getDates(),
          challenge: "The Container Challenge",
          notebook: "TheContainerChallenge",
          hours: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "pramod sareddy",
          email: "pramod@hpe.com",
          company: "HPE",
          ...getDates(),
          challenge: "The Grommet Challenge",
          notebook: "TheGrommetChallenge",
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
