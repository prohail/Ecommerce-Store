import React from "react";

export default function AboutUs() {
  return (
    <div className="container py-5">
      <h2>Our Mission</h2>
      <p className="fs-5 w-75">
        Our Mission is to maintain our position as the leader in the tile
        industry in Pakistan and for this purpose we will continue to focus on:
      </p>
      <ul className=" w-75">
        <li>
          We are committed to quality products and will provide our customers
          with innovative sizes, designs and color scheme that they will be
          delighted to have and shall provide them with excellent services to
          earn their loyalty.
        </li>
        <li>
          {" "}
          We shall treat our employees fairly and shall provide conducive
          working environment for them to learn and to grow with the company.
        </li>{" "}
        <li>
          The company shall earn adequate profits for its progress and growth
          and for providing reasonable return to its shareholders.
        </li>
      </ul>

      <h2 className="w-75 ms-auto">Our Vision</h2>
      <p className="fs-5 w-75 ms-auto">
        While maintaining our “Vtile” Brand as Market Leader, We continue to
        delight our Customers by also bringing in International brands in the
        field of Building Materials, By Offering the Best Quality and Innovative
        Products at competitive Prices, Taking into account the stakeholders’
        Interest.
      </p>

      <h2>Our Team</h2>
      <p className="fs-5 w-75">
        The team should be a team and not a group. A team performs activities
        that ensure that goals are consistently being met in an effective and
        efficient manner.
      </p>
    </div>
  );
}
