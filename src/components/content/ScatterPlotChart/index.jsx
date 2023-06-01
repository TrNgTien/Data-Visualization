import * as d3 from "d3";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";

//----------------------------Configurtion--------------------------------------------------
const svgStyle = {
  borderColor: "#000",
  borderWidth: "0.2rem",
  borderStyle: "solid",
  backgroundColor: "#fff",
};

const listColors = [
  "rgb(230, 42, 42)",
  "rgb(175, 44, 44)",
  "rgb(119, 46, 46) ",
  "rgb(64, 48, 48)",
];

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const yScale = d3.scaleLinear().domain([0, 250]).range([400, 0]);
const yAxis = d3.axisLeft(yScale);

const width = 1000;
const height = 500;

//----------------------------Rendering---------------------------------------------------
export const ScatterPlotChart = () => {
  const svgRef = useRef();

  const [data, setData] = useState([])

  const fetchDataLineChart = useCallback(async () => {
    const response = await d3.csv(
      "https://res.cloudinary.com/nguyenle23/raw/upload/v1685516151/me/fifa_500_new.csv"
    );

    setData(response)
  }, [data])

  const playerByAges = useCallback(() => {
    const result = [];
    const ageList = [];

    for (let i = 0; i < data.length; i++) {
      const age = data[i].Age;
      if (!ageList.includes(age)) {
        ageList.push(age);
      }
    }

    for (let j = 0; j < ageList.length; j++) {
      const filteredByAge = data.filter((d) => d.Age === ageList[j]);
      const overalRating = filteredByAge.map((d) => d.Overall_Rating);
      const overalNumericalValues = overalRating.map(Number);
      const sum = overalNumericalValues.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      const average = sum / overalNumericalValues.length;
      const resultOveralRating = average.toFixed(2);
      result.push([ageList[j], resultOveralRating]);
    }
    return result;
  }, [data]);

  const dataNew = playerByAges();


  const svg = d3.select(svgRef.current).append("g");

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataNew, (d) => d[0])])
    .range([0, 800]);
  const xAxis = d3.axisBottom(xScale);
  svg
    .append("text")
    .attr("x", 400)
    .attr("y", 30)
    .attr("class", "title-chart")
    .text("FIFA 500 Players' Overall Rating by Age")
    .style("font-size", "1.5rem")
    .style("font-weight", "bold")
    .style("postion", "absolute");

  // Create legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(900, 100)")
    .selectAll("g")
    .data(listColors)
    .enter()
    .append("g")
    .attr("transform", (_d, i) => `translate(0, ${i * 30})`);

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => d);

  legend
    .append("text")
    .attr("x", 30)
    .attr("y", 14)
    .attr("fill", "black")
    .text((_d, i) => {
      switch (i) {
        case 0: {
          return "80 - 100";
        }
        case 1: {
          return "70 - 80";
        }
        case 2: {
          return "60 - 70";
        }
        default: {
          return "0 - 60";
        }
      }
    });

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(70, 450)")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(70, 50)`)
    .call(yAxis);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("y", 25)
    .attr("x", -200)
    .text("Overall Rating");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("x", 500)
    .attr("y", 485)
    .text("Age");

  svg
    .selectAll("circle")
    .data(dataNew)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d[0]))
    .attr("cy", (d) => yScale(d[1]))
    .attr("r", 10)
    .attr("fill", (d) => {
      if (d[1] >= 80) {
        return "#E62A2A";
      } else if (d[1] >= 70) {
        return "#AF2C2C";
      } else if (d[1] >= 60) {
        return "#772E2E";
      } else {
        return "#403030";
      }
    })
    .on("mouseover", function(event, d) {
      d3.select(this).attr("r", 15);
      tooltip.transition().duration(100).style("opacity", 0.9);
      tooltip
        .html(`Age: ${d[0]} <br/> Overall Rating: ${d[1]}` + "/100")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseleave", function(_d) {
      d3.select(this).attr("r", 10);
      tooltip.transition().duration(100).style("opacity", 0);
    });


  useEffect(() => {
    fetchDataLineChart();
  }, []);

  return (
    <div className="line-chart-frame">
      <svg ref={svgRef} style={svgStyle} width={width} height={height}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};

