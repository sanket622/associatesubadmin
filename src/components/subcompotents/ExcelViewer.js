import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Box, Typography, Button } from "@mui/material";
import ReusableTable from "./ReusableTable";

/* ---------------- HELPERS ---------------- */

const isMeaningfulCell = (v) =>
  v !== undefined &&
  v !== null &&
  String(v).trim() !== "" &&
  String(v).trim() !== "-";

/**
 * Detect header row:
 * - At least 2 meaningful string cells
 */
const detectHeaderRowIndex = (rows) => {
  for (let i = 0; i < rows.length; i++) {
    const meaningful = rows[i].filter(
      (c) => typeof c === "string" && isMeaningfulCell(c)
    );
    if (meaningful.length >= 2) return i;
  }
  return -1;
};

/**
 * Extract clean table data
 */
const extractTable = (sheet) => {
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  const headerIndex = detectHeaderRowIndex(rows);
  if (headerIndex === -1) return null;

  const headers = rows[headerIndex]
    .map((h) => String(h).trim())
    .filter(isMeaningfulCell);

  if (headers.length < 2) return null;

  const dataRows = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const rowObj = {};
    let hasValue = false;

    headers.forEach((h, idx) => {
      const value = row[idx];
      rowObj[h] = isMeaningfulCell(value) ? value : "-";
      if (isMeaningfulCell(value)) hasValue = true;
    });

    if (hasValue) dataRows.push(rowObj);
  }

  if (!dataRows.length) return null;

  return {
    columns: headers.map((h) => ({ key: h, label: h })),
    rows: dataRows,
  };
};

/* ---------------- COMPONENT ---------------- */

const ExcelViewer = ({ fileUrl }) => {
  const [workbook, setWorkbook] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);
  const [htmlSheet, setHtmlSheet] = useState(null);
  const [tableMode, setTableMode] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  /* ---------------- LOAD FILE ---------------- */
  useEffect(() => {
    if (!fileUrl) return;

    fetch(fileUrl)
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        const wb = XLSX.read(buf, { type: "array" });
        setWorkbook(wb);
        setActiveSheet(wb.SheetNames[0]); // index page
      });
  }, [fileUrl]);

  /* ---------------- OPEN INTERNAL LINK ---------------- */
  const openInternalSheet = (target) => {
    const match = target.match(/#'?(.+?)'?!/);
    if (!match) return;

    const sheetName = match[1];
    const sheet = workbook?.Sheets?.[sheetName];
    if (!sheet) return;

    console.log("➡️ Opened sheet:", sheetName);

    const table = extractTable(sheet);

    setActiveSheet(sheetName);

    if (table) {
      console.log("✅ Rendering as ReusableTable");
      setColumns(table.columns);
      setRows(table.rows);
      setTableMode(true);
    } else {
      console.log("⚠️ Falling back to HTML view");
      setHtmlSheet(sheet);
      setTableMode(false);
    }
  };

  /* ---------------- RENDER HTML SHEET ---------------- */
  const renderHtmlSheet = () => {
    if (!htmlSheet) return null;

    const html = XLSX.utils.sheet_to_html(htmlSheet, {
      editable: false,
    });

    return (
      <Box
        sx={{ overflowX: "auto" }}
        dangerouslySetInnerHTML={{
          __html: html.replace(
            /<a href="([^"]+)"/g,
            `<a href="#" onclick="window.__openSheet('$1')"`
          ),
        }}
      />
    );
  };

  /* ---------------- BIND LINK HANDLER ---------------- */
  useEffect(() => {
    window.__openSheet = openInternalSheet;
    return () => delete window.__openSheet;
  }, [workbook]);

  /* ---------------- UI ---------------- */
  return (
    <Box>
      <Typography variant="h6" sx={{ p: 1 }}>
        {activeSheet}
      </Typography>

      {tableMode ? (
        <ReusableTable
          columns={columns}
          data={rows}
          showSearch={false}
        />
      ) : (
        renderHtmlSheet()
      )}
    </Box>
  );
};

export default ExcelViewer;
