module.exports = {
  up: queryInterface => {
    const N = 5;
    const arr = [...Array(N + 1).keys()].slice(1);
    const entries = arr.map(key => ({
      createdAt: new Date(),
      updatedAt: new Date(),
      //   customerId: 0,
      url: `https://notebooks2.hpedev.io/user/student${key}/lab?`,
      username: `student${key}`,
      password: "MyNewPassword"
    }));

    return queryInterface.bulkInsert("students", entries, { returning: true });
  },

  down: queryInterface => queryInterface.bulkDelete("students", null, {})
};
