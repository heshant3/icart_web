import React, { useState, useEffect } from "react";
import "./App.css";
import { LiaOpencart } from "react-icons/lia";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import AppLogo from "./Applogo.png"; // Importing the local image

function App() {
  const [OrderHistoryData, setOrderHistoryData] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const OrderHistoryRef = ref(db, "Order");
    onValue(OrderHistoryRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        // Convert the object values into an array
        const OrderHistoryArray = Object.values(firebaseData);

        // Sort the OrderHistoryArray based on the timestamp property in descending order
        OrderHistoryArray.sort((a, b) => b.timestamp - a.timestamp);

        // Reverse the sorted array to ensure the newest data appears at the top
        OrderHistoryArray.reverse();

        // Set the sorted and reversed array to the state
        setOrderHistoryData(OrderHistoryArray);
      }
    });
  }, []);

  useEffect(() => {
    const orderRef = ref(db, `Order`);
    onValue(orderRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        // Filter the order items array based on the orderId
        const filteredOrderItems = Object.values(firebaseData)
          .filter((item) => item.orderId === selectedOrderId)
          .flatMap((order) => order.items); // Flattening array of arrays
        setOrderItems(filteredOrderItems);

        // Calculate total price and total quantity
        const totalP = filteredOrderItems.reduce(
          (acc, curr) => acc + curr.Price * curr.count,
          0
        );
        setTotalPrice(totalP);

        const totalQ = filteredOrderItems.reduce(
          (acc, curr) => acc + curr.count,
          0
        );
        setTotalQuantity(totalQ);
      }
    });
  }, [selectedOrderId]);

  const handleBoxClick = (orderId) => {
    setSelectedOrderId(orderId);
  };

  return (
    <div className="Container">
      <div className="Nav">
        <div className="logo">
          <img
            className="Imageview1"
            src={AppLogo}
            alt="Description of the image"
          />
        </div>
        <div className="Header">
          <text className="HeaderText">Admin Dash Board</text>
        </div>
      </div>
      <div className="Content">
        <div className="LeftPane">
          <div className="Head">
            <text className="HeadText">Orders History</text>
          </div>

          <div className="ScrollableContent">
            {OrderHistoryData.map((order, index) => (
              <div
                className="Box"
                key={index}
                onClick={() => handleBoxClick(order.orderId)}
              >
                <view className="Icon">
                  <LiaOpencart style={{ color: "#707070", fontSize: "5rem" }} />
                </view>
                <view className="Details">
                  <text className="CatText">Cart-1</text>
                  <text className="IdText">Order ID: {order.orderId}</text>
                  <text className="IdText">Date: {order.Date}</text>
                </view>
              </div>
            ))}
          </div>
        </div>
        <div className="VerticalLine"></div> {/* Vertical Line */}
        <div className="RightPane">
          <div className="Head">
            <text className="HeadText">Order Items</text>
          </div>

          <div className="ScrollableContent">
            {orderItems.map((item, index) => (
              <div className="Box" key={index}>
                <div className="Image">
                  <img
                    className="Imageview"
                    src={item.Image}
                    alt="Description of the image"
                  />
                </div>
                <div className="Details">
                  <text className="CatText">{item.Name}</text>
                  <text className="IdText">Quantity: {item.count}</text>
                  <text className="IdText">M.R.P: Rs.{item.Price}</text>
                </div>
              </div>
            ))}
          </div>
          <div className="TotalInfo">
            <div className="QuantityView">
              <div className="TotalInfoText">Total Quantity:</div>
              <div className="TotalInfoText">{totalQuantity}</div>
            </div>
            <div className="QuantityView">
              <div className="TotalPriceText">Total Price:</div>
              <div className="TotalPriceText">Rs. {totalPrice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
