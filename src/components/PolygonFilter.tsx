import { useEffect, useState, useCallback } from "react";
import {
  Slider,
  Typography,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./PolygonFilter.module.css";

interface PolygonData {
  code: number;
  status: string;
  price: number;
}

interface Props {
  polygonData: PolygonData[];
}

const STATUS_COLORS: Record<string, string> = {
  sold: "red",
  available: "green",
  reserved: "yellow",
  all: "", // Original color (could specify a default if needed)
};

const PolygonFilter: React.FC<Props> = ({ polygonData }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number[]>([
    0,
    Math.max(...polygonData.map((d) => d.price)),
  ]);

  const shouldPolygonBeVisible = useCallback(
    (polygonDataItem: PolygonData): boolean => {
      return (
        (selectedStatus === "All" ||
          polygonDataItem.status === selectedStatus) &&
        polygonDataItem.price >= priceRange[0] &&
        polygonDataItem.price <= priceRange[1]
      );
    },
    [selectedStatus, priceRange]
  );

  const updatePolygonVisibility = useCallback(
    (polygons: NodeListOf<SVGPolygonElement>) => {
      polygons.forEach((polygon) => {
        const dataCode = polygon.getAttribute("data-code");
        if (dataCode) {
          const polygonDataItem = polygonData.find(
            (item) => item.code === parseInt(dataCode)
          );

          if (polygonDataItem) {
            const isVisible = shouldPolygonBeVisible(polygonDataItem);
            polygon.style.display = isVisible ? "block" : "none";
            polygon.style.fill = isVisible
              ? STATUS_COLORS[selectedStatus.toLowerCase()]
              : "none";
          }
        }
      });
    },
    [polygonData, selectedStatus, shouldPolygonBeVisible]
  );

  useEffect(() => {
    const polygons = document.querySelectorAll<SVGPolygonElement>("polygon");
    updatePolygonVisibility(polygons);
  }, [selectedStatus, priceRange, updatePolygonVisibility]);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue);
    }
  };

  const maxRange = Math.max(...polygonData.map((d) => d.price));

  return (
    <div className={styles.controlPanel}>
      <h4>Polygon Filtering</h4>
      <div>
        <label htmlFor="statusSelect">Status: </label>
        <Select
          id="statusSelect"
          value={selectedStatus}
          onChange={handleStatusChange}
          variant="outlined"
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="reserved">Reserved</MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="sold">Sold</MenuItem>
        </Select>
      </div>

      <Box sx={{ width: "100%" }}>
        <Typography gutterBottom>Price Range:</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={maxRange}
          disableSwap
        />
        <div className={styles.priceRangeLabel}>
          <span>Min: ${priceRange[0]}</span> -{" "}
          <span>Max: ${priceRange[1]}</span>
        </div>
      </Box>
    </div>
  );
};

export default PolygonFilter;
