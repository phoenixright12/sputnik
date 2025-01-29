import GeneralInfo from "../pages/GeneralInfo";
import Education from "../pages/Education";
import ExternalFeatures from "../pages/ExternalFeatures";
import EndOfRegistration from "../pages/EndOfRegistration";
import Settings from "../pages/Settings";
import PersonLife from "../pages/PersonLife";
import Family from "../pages/Family";
import Habitation from "../pages/Habitation";
import Preferences from "../pages/Preferences";
import StepsPanel from "../components/Steps";
import config from "../general/config";
export default function PageWithSteps(props) {
  // const handleData = (data) => {
  //   console.log("ало:", data);
  // };

  // const handleData = async (data) => {
  //   const access_token = localStorage.getItem("access_token");
  //   try {
  //     const response = await fetch(`${config.serverUrl}api/users.editProfile`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data), // Передаем данные в теле запроса
  //     });

  //     if (!response.ok) {
  //       throw new Error("Ошибка при отправке данных");
  //     }

  //     const responseData = await response.json();
  //     console.log("Ответ от API:", responseData);
  //   } catch (error) {
  //     console.error("Ошибка при отправке данных:", error);
  //   }
  // };
  const stepsMapping = {
    "general-info": 1,
    education: 2,
    "external-features": 3,
    "end-of-registration": 4,
  };
  // console.log("city:", city);
  return (
    <div>
      <StepsPanel progress={stepsMapping[props.page]} />
      {props.page === "general-info" && <GeneralInfo onSendData={""} />}
      {props.page === "education" && <Education onSendData={""} />}
      {props.page === "external-features" && <ExternalFeatures />}
      {props.page === "end-of-registration" && <EndOfRegistration />}
    </div>
  );
}
