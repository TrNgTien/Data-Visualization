import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./GeoChart.css";

//----------------------------Configurtion--------------------------------------------------
const width = 1000;
const height = 500;
let zoomLevel = 1;
const centerX = width / 2;
const centerY = height / 2;

//tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const svgStyle = {
  borderColor: "#000",
  borderWidth: "0.2rem",
  borderStyle: "solid",
  backgroundColor: "#0e90b8",
};

//----------------------------Rendering---------------------------------------------------
export const GeoChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([])

  const fetchDataGeo = useCallback(async () => {
    const response = await d3.csv(
      "https://res.cloudinary.com/nguyenle23/raw/upload/v1685516151/me/fifa_500_new.csv"
    );

    setData(response)
  }, [data])

  const countPlayersByCountry = useCallback(() => {
    const result = [];

    for (let i = 0; i < data.length; i++) {
      const country = data[i].Country;
      const duration = data[i].Duration;
      const index = result.findIndex((item) => item.country === country);

      if (index !== -1) {
        result[index].count += 1;
      }

      result.push({ country: country, duration: duration, count: 1 });
    }
    return result;
  }, [data]);

  const dataPlayer = countPlayersByCountry();

  dataPlayer.pop();

  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ).then((data) => {
    const projection = d3.geoMercator().fitSize([1000, 500], data);
    const path = d3.geoPath().projection(projection);
    const svg = d3.select(svgRef.current);

    // Render the map
    svg
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#1EA362")
      .attr("stroke", "black")
      .attr("stroke-width", 0.4)
      .on("mouseover", (event, d) => {
        // Handle mouseover event
        d3.select(event?.target).attr("fill", "#077e4e");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(() => {
            if (!dataPlayer) {
              return;
            }

            const playerData = dataPlayer.find(
              (item) => item.country === d.properties.name
            );

            if (!playerData) {
              return (
                "<strong>Country: </strong>" +
                d.properties.name +
                "<br/>" +
                "<strong>Number of players: </strong>" +
                0
              );
            }
            return (
              "<strong>Country: </strong>" +
              d.properties.name +
              "<br/>" +
              "<strong>Number of players: </strong>" +
              playerData.count
            );

          })
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", (event, _d) => {
        d3.select(event?.target).attr("fill", "#1EA362");
      })
      .on("mouseleave", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });


    // Define the zoom function
    function zoom() {
      svg
        .selectAll("path,circle,text")
        .transition()
        .duration(750)
        .attr(
          "transform",
          `translate(${centerX}, ${centerY}) scale(${zoomLevel}) translate(${-centerX}, ${-centerY})`
        );
    }

    // Handle zoom-in event
    function handleZoomIn() {
      zoomLevel *= 2;
      zoom();
    }

    // Handle zoom-out event
    function handleZoomOut() {
      zoomLevel /= 2;
      zoom();
    }

    // Append zoom-in button
    const zoomInButton = svg
      .append("g")
      .attr("class", "zoom-in-btn")
      .attr("transform", "translate(20, 20)")
      .on("click", handleZoomIn);

    zoomInButton
      .append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "white")
      .attr("stroke", "black");

    zoomInButton
      .append("text")
      .attr("x", 15)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", 20)
      .text("+");

    // Append zoom-out button
    const zoomOutButton = svg
      .append("g")
      .attr("transform", "translate(60, 20)")
      .on("click", handleZoomOut);

    zoomOutButton
      .append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    zoomOutButton
      .append("text")
      .attr("x", 15)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", 20)
      .text("-");
  });

  //----------------------------------------------------
  useEffect(() => {
    fetchDataGeo();
  }, []);

  return <svg ref={svgRef} style={svgStyle} width={1000} height={500}></svg>;
};

