// Function to fetch data from the URL and creating horizontal bar chart
function buildBarChart(selectedSubjectId) {
    // Using D3 Library to fetch data from provided URL
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
      // Filter data to get selected test subjects information
      var selectedData = data.samples.filter(sample => sample.id === selectedSubjectId)[0];
  
      // Sorting data to get top 10 OTUs based on sample_values
      var top10OTUs = selectedData.sample_values.slice(0, 10).reverse();
      var top10OTUIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      var top10OTULabels = selectedData.otu_labels.slice(0, 10).reverse();
  
      // Creating trace for the horizontal bar chart
      var trace = {
        type: "bar",
        x: top10OTUs,
        y: top10OTUIds,
        text: top10OTULabels,
        orientation: 'h'
      };
  
      // Creating data array containing the trace
      var data = [trace];
  
      // Defining layout for horizontal bar chart
      var layout = {
        title: `Top 10 OTUs for Test Subject ${selectedSubjectId}`,
        xaxis: { title: "Sample Values" },
        // Can Display y-axis in decending order per below code
        // yaxis: { autorange: "reversed" },
        margin: { l: 150 } // Adjust left margin to accommodate long OTU labels
      };
  
      // Plot the horizontal bar chart using Plotly
      Plotly.newPlot("bar", data, layout);
    });
  }
  
  // Function to fetch data from the URL and creating bubble chart
  function buildBubbleChart(selectedSubjectId) {
    // Using D3 to fetch data from the provided URL
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
      // Filter the data to get selected test subjects information
      var selectedData = data.samples.filter(sample => sample.id === selectedSubjectId)[0];
  
      // Creating trace for the bubble chart
      var trace = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        text: selectedData.otu_labels,
        mode: 'markers',
        marker: {
          size: selectedData.sample_values,
          sizemode: 'diameter',
          sizeref: 0.1,
          color: selectedData.otu_ids,
          colorscale: 'Viridis'
        }
      };
  
      // Creating data array containing the trace
      var data = [trace];
  
      // Defining layout for the bubble chart
      var layout = {
        title: `Sample ${selectedSubjectId} - Biodiversity`,
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" },
        margin: { l: 80, r: 10, t: 60, b: 80 } // Adjust margins for better display
      };
  
      // Plot the bubble chart using Plotly
      Plotly.newPlot("bubble", data, layout);
    });
  }
  
  // Function to display the sample metadata
  function displayMetadata(selectedSubjectId) {
    // Using D3 to fetch data from the provided URL
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
      // Filter the metadata to get the selected test subject's information
      var metadata = data.metadata.filter(meta => meta.id === parseInt(selectedSubjectId))[0];
  
      // Select the sample-metadata div and clear any existing content
      var metadataDiv = d3.select("#sample-metadata");
      metadataDiv.html("");
  
      // Loop through the metadata object and append each key-value pair to the metadataDiv
      Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv.append("p").text(`${key}: ${value}`);
      });
    });
  }
  
  // Function to handle the change in the dropdown menu selection
  function optionChanged(selectedValue) {
    // Call the functions to update the horizontal bar chart, bubble chart, and display sample metadata
    buildBarChart(selectedValue);
    buildBubbleChart(selectedValue);
    displayMetadata(selectedValue);
  }
  
  // Fetch the data and initialize the default horizontal bar chart, bubble chart, and sample metadata using the first test subject ID
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    // Get the list of test subject IDs
    var subjectIds = data.names;
  
    // Populate the dropdown menu with the test subject IDs
    var dropdownMenu = d3.select("#selDataset");
    subjectIds.forEach(subjectId => {
      dropdownMenu.append("option").attr("value", subjectId).text(subjectId);
    });
  
    // Initialize the default horizontal bar chart, bubble chart, and sample metadata with the first test subject ID
    buildBarChart(subjectIds[0]);
    buildBubbleChart(subjectIds[0]);
    displayMetadata(subjectIds[0]);
  });
  