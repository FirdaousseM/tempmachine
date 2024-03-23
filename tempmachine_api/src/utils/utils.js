let remainingTime;

const startTimer = (timeToWait) => {
  timeToWait *= 60;
  let remainingTime = timeToWait;

  const countDown = setInterval(() => {
    remainingTime--;

    console.log(remainingTime);

    let minutes = Math.floor(remainingTime / 60);
    let seconds = Math.floor(remainingTime % 60);

    console.log(minutes + "min " + seconds + "sec ");

    if (remainingTime <= 0) {
      console.log("Compte à rebours terminé");
      deleteVirtualMachine();
      clearInterval(countDown);
    }
  }, 1000);
};

const getRemainingTime = () => {
  return {
    minutes: Math.floor(remainingTime / 60),
    seconds: Math.floor(remainingTime % 60),
  };
};

const randomNumber = () => {
  return Math.floor(Math.random() * 1000);
};

module.exports = {
  startTimer,
  getRemainingTime,
  randomNumber,
};
