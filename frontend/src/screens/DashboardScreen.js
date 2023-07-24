import React, { useContext, useEffect, useReducer, useState } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  // State variables for filtered sales data
  const [salesToday, setSalesToday] = useState([]);
  const [salesPastWeek, setSalesPastWeek] = useState([]);
  const [salesPastMonth, setSalesPastMonth] = useState([]);

  // State variable for search date
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/orders/summary", {
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
    fetchData();
  }, [userInfo]);

  useEffect(() => {
    // If summary is available, filter sales data
    if (summary) {
      // Filter sales data by date when searchDate changes
      if (searchDate) {
        const filteredSales = summary.dailyOrders.filter(
          (order) => order._id === searchDate
        );
        setSalesToday(filteredSales);
      } else {
        setSalesToday(summary.dailyOrders);
      }

      // Calculate sales of the past week
      const today = new Date();
      const pastWeekDate = new Date(today);
      pastWeekDate.setDate(today.getDate() - 7);
      const filteredSalesPastWeek = summary.dailyOrders.filter(
        (order) => new Date(order._id) >= pastWeekDate
      );
      setSalesPastWeek(filteredSalesPastWeek);

      // Calculate sales of the past month
      const pastMonthDate = new Date(today);
      pastMonthDate.setMonth(today.getMonth() - 1);
      const filteredSalesPastMonth = summary.dailyOrders.filter(
        (order) => new Date(order._id) >= pastMonthDate
      );
      setSalesPastMonth(filteredSalesPastMonth);
    }
  }, [searchDate, summary]);

  return (
    <div className="py-5">
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : !summary ? (
        <MessageBox variant="info">Summary data not available.</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    Rs.
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    Rs.{" "}
                    {salesToday.length > 0
                      ? salesToday[0].sales.toFixed(2)
                      : "N/A"}
                  </Card.Title>
                  <Card.Text> Sales On Selected Date</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    Rs.{" "}
                    {salesPastWeek.length > 0
                      ? salesPastWeek
                          .reduce((total, order) => total + order.sales, 0)
                          .toFixed(2)
                      : "N/A"}
                  </Card.Title>
                  <Card.Text> Sales Past Week</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    Rs.{" "}
                    {salesPastMonth.length > 0
                      ? salesPastMonth
                          .reduce((total, order) => total + order.sales, 0)
                          .toFixed(2)
                      : "N/A"}
                  </Card.Title>
                  <Card.Text> Sales Past Month</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="my-3">
            <div className="mb-3 w-25">
              <label htmlFor="searchDate" className="form-label">
                Select Date:
              </label>
              <input
                type="date"
                id="searchDate"
                className="form-control"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
          </div>

          <div className="my-3">
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No Sale</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Date", "Sales"],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No Category</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
