import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import MarketPlace from "./pages/marketplace";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import { useSelector } from "react-redux";
import Activate from "./pages/home/activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { postsReducer } from "./functions/reducers";
import Friends from "./pages/friends";
import BrowseAllPage from "./pages/marketplace/browse";
import NotificationPage from "./pages/notification/";
import BuyingPage from "./pages/marketplace/buying";
import SellingPage from "./pages/marketplace/selling";
import WalletPage from "./pages/wallet";
import Messenger from "./pages/messenger";
import ValidatorPage from "./pages/validator";
import AdminLogin from "./pages/admin/auth/login";
import UsersPage from "./pages/admin/users";
import ProductsPage from "./pages/admin/products";
import AdminDashboardPage from "./pages/admin";
import PostsPage from "./pages/admin/posts";

function App() {
  const [visible, setVisible] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  useEffect(() => {
    getAllPosts();
  }, []);
  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllposts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  return (
    <div>
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route path="dashboard/*" element={<AdminDashboardPage />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="posts" element={<PostsPage />} />
          </Route>
          <Route
            path="marketplace"
            element={
              <MarketPlace setVisible={setVisible} getAllPosts={getAllPosts} />
            }
          >
            <Route path="" element={<BrowseAllPage />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path="buying" element={<BuyingPage />} />
            <Route path="selling" element={<SellingPage />} />
          </Route>
          <Route
            path="/profile"
            element={
              <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/wallet"
            element={
              <WalletPage setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/validator"
            element={
              <ValidatorPage
                setVisible={setVisible}
                getAllPosts={getAllPosts}
              />
            }
            exact
          />
          <Route
            path="/messenger"
            element={
              <Messenger setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/notification"
            element={
              <NotificationPage
                setVisible={setVisible}
                getAllPosts={getAllPosts}
              />
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={
              <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/friends"
            element={
              <Friends setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/friends/:type"
            element={
              <Friends setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/"
            element={
              <Home
                setVisible={setVisible}
                posts={posts}
                loading={loading}
                getAllPosts={getAllPosts}
              />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
          <Route path="/admin" element={<AdminLogin />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
