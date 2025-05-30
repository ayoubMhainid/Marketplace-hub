import moment from "moment";
import { UserSideBar } from "../../layouts/UserSideBar";
import { Store } from "../../components/App/Store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { viewStoresUser, viewUserData } from "../../services/userServices";
import { Notification } from "../../components/ui/Notification";
import { UserSkeleton } from "../../components/skeletons/UserSkeleton";
import { StoreSkeleton } from "../../components/skeletons/StoreSkeleton";
import { AdminSideBar } from "../../layouts/AdminSideBar";

export const UserData = () => {
  const [userData, setUserData] = useState({});
  const [storesData, setStoresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Sloading, setSloading] = useState(true);
  const [notification, setNotification] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await viewUserData(localStorage.getItem("token"), id);
      setUserData(response.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      navigate(-1);
    }
  };

  const getStoresUser = async () => {
    setNotification(null);
    setSloading(true);
    try {
      const response = await viewStoresUser(localStorage.getItem("token"), id);
      setSloading(false);
      setStoresData(response.stores);
    } catch (error) {
      setSloading(false);
      if (error.response) {
        setNotification({
          type: "error",
          message: error.response.data.message,
        });
      } else {
        setNotification({ type: "error", message: "Try again later" });
      }
    }
  };

  useEffect(() => {
    getUserData();
    getStoresUser();
  }, []);

  return (
    <div>
      <div>
        {localStorage.getItem("role") === "admin" ||
        localStorage.getItem("role") === "super admin" ? (
          <AdminSideBar />
        ) : (
          <UserSideBar />
        )}
      </div>
      <div className="lg:ml-[21%] px-2">
        {loading ? (
          <div>
            <UserSkeleton />
          </div>
        ) : null}

        {!loading && (
          <div className="mt-6">
            <div>
              <div className="flex gap-4 items-center">
                <div>
                  <img
                    src={userData.profile_picture}
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                <div className="flex justify-start flex-col">
                  <span className="text-2xl font-semibold">
                    {userData.fullName}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {userData.username}
                  </span>
                  {
                    userData.role === "admin" || userData.role === "super admin" ? (
                      <span className="font-semibold bg-blue-500 text-white w-[60%] text-center rounded-md">
                        {userData.role}
                      </span>
                    ):null
                  }
                  <span className="font-semibold text-gray-700">
                    Joined at {moment(userData.created_at).format("DD-MM-YYYY")}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-500">{userData.bio}</span>
              </div>
              <div className="border border-gray-700 w-[100%] mt-2"></div>
            </div>
          </div>
        )}
        {Sloading ? (
          <div className="py-2 flex flex-wrap justify-start gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <StoreSkeleton key={n} />
            ))}
          </div>
        ) : null}
        {!Sloading && (
          <div className="py-2 flex flex-wrap gap-4 justify-start">
            {storesData && storesData.length
              ? storesData.map((storeData) => {
                  return <Store key={storeData.id} storeData={storeData} />;
                })
              : "This user doesn't any stores"}
          </div>
        )}

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </div>
    </div>
  );
};
