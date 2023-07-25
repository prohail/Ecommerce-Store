import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      orders: [],
    });

  const [sortOrder, setSortOrder] = useState({
    column: "createdAt",
    direction: "desc",
  });

  const handleSort = (column) => {
    setSortOrder((prevState) => ({
      column,
      direction:
        prevState.column === column && prevState.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("order deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortedOrders = orders.sort((a, b) => {
    const { column, direction } = sortOrder;
    const propA = a[column];
    const propB = b[column];

    if (typeof propA === "string" && typeof propB === "string") {
      const compareResult = propA.localeCompare(propB);
      return direction === "asc" ? compareResult : -compareResult;
    } else {
      return direction === "asc" ? propA - propB : propB - propA;
    }
  });

  const filteredOrders = sortedOrders.filter((order) => {
    const userName = order.user
      ? order.user.name.toLowerCase()
      : "deleted user";
    return userName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="py-5">
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      <Form>
        <Form.Group className="mb-3 w-25">
          <Form.Control
            type="text"
            placeholder="Search by user name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form.Group>
      </Form>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("createdAt")}>DATE</th>
              <th onClick={() => handleSort("user")}>USER</th>
              <th onClick={() => handleSort("totalPrice")}>TOTAL</th>
              <th onClick={() => handleSort("isPaid")}>PAID</th>
              <th onClick={() => handleSort("isDelivered")}>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.user ? order.user.name : "DELETED USER"}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
