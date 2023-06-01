import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const Chart = ({ type }) => {
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (true) {
        const response = await d3.csv(
          "https://res.cloudinary.com/nguyenle23/raw/upload/v1685516151/me/fifa_500_new.csv"
        );

        const countPlayersByCountry = (data) => {
          const result = [];
          for (let i = 0; i < data.length; i++) {
            const country = data[i].Country;
            const index = result.findIndex((item) => item.country === country);
            if (index === -1) {
              result.push({ country: country, count: 1 });
            }
            if (index !== -1) {
              result[index].count += 1;
            }
          }
          return result;
        };

        const data = countPlayersByCountry(response);
        const scale_value = 2.5;
        const chart_frame_height = 500;
        const rect_width = 18.5;
        const distance_next_rect = 20;
        const padding_x = 128;

        data.pop();

        const xScale = d3
          .scaleBand()
          .domain(data.map((d) => d.country))
          .range([0, data.length * distance_next_rect * scale_value])
          .padding(0.1);
        const xAxis = d3.axisBottom(xScale);

        const yScale = d3.scaleLinear().domain([58, 0]).range([0, 290]);
        const yAxis = d3.axisLeft(yScale);

        const svg = d3
          .select("#chart")
          .append("svg")
          .attr(
            "width",
            data.length * distance_next_rect * scale_value + padding_x
          )
          .attr("height", chart_frame_height)
          .append("g");

        svg
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d, i) => i * distance_next_rect * scale_value + 50)
          .attr("y", (d) => {
            return chart_frame_height - d["count"] * 5 - distance_next_rect;
          })
          .attr("width", rect_width * scale_value)
          .attr("height", (d) => {
            return d["count"] * 5;
          })
          .attr("fill", "#32a0f8");

        svg
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .text((d) => d["count"])
          .attr("class", "text")
          .attr(
            "x",
            (d, i) =>
              i * distance_next_rect * scale_value +
              42 +
              (rect_width * scale_value) / 2
          )
          .attr("y", (d, i) => {
            return (
              chart_frame_height -
              d["count"] * 5 -
              distance_next_rect * scale_value +
              20
            );
          })
          .attr("fill", "black");

        svg
          .append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(50, 480)")
          .call(xAxis);

        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("font-weight", "bolder")
          .attr("fill", "black")
          .attr("x", data.length * distance_next_rect * scale_value + padding_x)
          .attr("y", 480)
          .attr("class", "countries")
          .text("Countries");

        svg
          .append("g")
          .attr("class", "y-axis")
          .attr("transform", `translate(50, 190)`)
          .call(yAxis);

        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("font-weight", "bolder")
          .attr("fill", "black")
          .attr("x", 150)
          .attr("y", 180)
          .attr("class", "number")
          .text("Number of players");

        setDataFetched(true);
      }
    };
    fetchData();

    return () => {
      d3.select("#chart").selectAll("*").remove();
    };
  });

  return (
    <div id="chart-frame">
      <h2 className="title">
        Bar Chart Indicating Global Distribution of Football Players by Country
        And Duration From 2011 to 2028
      </h2>
      <div id="chart"></div>
    </div>
  );
};

export default Chart;
