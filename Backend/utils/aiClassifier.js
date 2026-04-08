function classifyComplaint(text) {

 text = text.toLowerCase()

 if (text.includes("wifi") || text.includes("internet") || text.includes("system")) {
  return "IT"
 }

 if (text.includes("ac") || text.includes("electricity") || text.includes("water")) {
  return "Facilities"
 }

 if (text.includes("salary") || text.includes("leave")) {
  return "HR"
 }

 return "General"
}

module.exports = classifyComplaint