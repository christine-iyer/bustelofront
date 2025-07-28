import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const isSmallScreen = width < 600;
export const isLargeScreen = width >= 1024;
export const numColumns = isSmallScreen ? 1 : isLargeScreen ? 3 : 2;


export const listReviewsStyles = StyleSheet.create({
  emptyText: {
    color: "#333",
    fontSize: 16,
    fontStyle: "italic",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f3f0", // Warm paper-like background
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    height: 40,
    borderColor: "#d4c5b9",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    margin: 10,
    backgroundColor: "#fff8f0",
    fontSize: 16,
    fontFamily: "Georgia", // More notebook-like font
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridContainer: {
    padding: 15,
  },
  row: {
    justifyContent: "space-around",
  },
  gridItem: {
    flex: 1,
    margin: isSmallScreen ? 8 : 12,
    backgroundColor: "#fefefe", // Notebook paper white
    borderRadius: 0, // Sharp corners like paper
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "visible", // Allow tape to show outside
    width: isSmallScreen 
      ? width - 32
      : isLargeScreen 
        ? (width - 84) / 3
        : (width - 52) / 2,
    // Add notebook lines effect
    borderLeftWidth: 2,
    borderLeftColor: "#ff6b6b", // Red margin line
    paddingLeft: 15,
    position: "relative",
  },
  
  // Notebook lines overlay
  notebookLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(173, 216, 230, 0.3)", // Light blue lines
  },
  
  imageContainer: {
    position: "relative",
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  
  // Tape effect for photos
  photoTape: {
    position: "absolute",
    width: 40,
    height: 20,
    backgroundColor: "rgba(255, 248, 220, 0.9)", // Cream tape color
    borderWidth: 1,
    borderColor: "rgba(218, 165, 32, 0.3)",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  
  // Multiple tape pieces for realistic effect
  tapeTopLeft: {
    top: -10,
    left: 20,
    transform: [{ rotate: '-15deg' }],
  },
  
  tapeTopRight: {
    top: -10,
    right: 20,
    transform: [{ rotate: '12deg' }],
  },
  
  tapeBottomLeft: {
    bottom: -10,
    left: 30,
    transform: [{ rotate: '8deg' }],
  },
  
  tapeBottomRight: {
    bottom: -10,
    right: 25,
    transform: [{ rotate: '-10deg' }],
  },

  imageGallery: {
    width: "85%", // Slightly smaller to look like taped photos
    height: "100%",
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  
  imageCarousel: {
    width: "100%",
    height: "100%",
  },
  
  imageCarouselContent: {
    alignItems: "flex-start",
  },
  
  imageSlide: {
    justifyContent: "center",
    alignItems: "center",
  },
  
  reviewImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
  },
  
  imageIndicators: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(139, 69, 19, 0.8)", // Brown dots like pencil marks
    marginHorizontal: 3,
  },
  
  imageCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 248, 220, 0.95)", // Paper-like badge
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.3)",
  },
  
  imageCountText: {
    color: "#8B4513", // Brown text
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "Georgia",
  },
  
  placeholderImage: {
    width: "85%",
    height: 200,
    backgroundColor: "#f5f5dc", // Beige placeholder
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed", // Dashed border for empty state
  },
  
  placeholderText: {
    fontSize: 48,
    color: "#bbb",
  },
  
  contentContainer: {
    padding: 12,
    minHeight: 60,
    position: "relative",
  },
  
  labelText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8B4513", // Brown ink color
    marginTop: 8,
    marginBottom: 2,
    textTransform: "uppercase",
    fontFamily: "Georgia",
    letterSpacing: 0.5,
  },
  
  gridTitle: {
    fontSize: isSmallScreen ? 18 : 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2F4F4F", // Dark slate gray like pen ink
    lineHeight: isSmallScreen ? 22 : 18,
    fontFamily: "Georgia",
  },
  
  gridAuthor: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 6,
    color: "#696969",
    fontFamily: "Georgia",
  },
  
  genreTag: {
    fontSize: 11,
    color: "#4682B4", // Steel blue
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
    backgroundColor: "rgba(70, 130, 180, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(70, 130, 180, 0.3)",
    fontFamily: "Georgia",
  },
  
gridText: {
  fontSize: isSmallScreen ? 14 : 12,
  color: "#2F4F4F",
  lineHeight: isSmallScreen ? 20 : 18, // Increased line height for better readability
  marginBottom: 8,
  fontFamily: "Georgia",
  fontStyle: "italic",
  // Removed numberOfLines restriction to show full text
},
gridTitle: {
  fontSize: isSmallScreen ? 20 : 18, // Slightly larger for prominence
  fontWeight: "bold",
  marginBottom: 4, // Reduced spacing
  color: "#2F4F4F", // Dark slate gray like pen ink
  lineHeight: isSmallScreen ? 24 : 22,
  fontFamily: "Georgia",
  letterSpacing: 1, // Add letter spacing for capitalized text
},

// Update gridAuthor for the "By" format:
gridAuthor: {
  fontSize: 14,
  fontStyle: "italic",
  marginBottom: 8,
  color: "#696969",
  fontFamily: "Georgia",
},
  
dateText: {
  fontSize: 11,
  color: "#A0A0A0",
  fontStyle: "italic",
  marginBottom: 10, // More space before genre
  fontFamily: "Georgia",
},
  
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(173, 216, 230, 0.5)", // Light blue line
    backgroundColor: "rgba(248, 248, 255, 0.8)", // Very light blue tint
    flexWrap: "wrap",
    marginTop: 10,
  },
  
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "rgba(255, 248, 220, 0.8)", // Cream background
    minWidth: 45,
    minHeight: 36,
    justifyContent: "center",
    margin: 3,
    borderWidth: 1,
    borderColor: "rgba(218, 165, 32, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  actionIcon: {
    fontSize: 14,
    marginRight: 3,
  },
  
  actionCount: {
    fontSize: 10,
    color: "#8B4513",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  actionText: {
    fontSize: 9,
    color: "#8B4513",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  // Edit form styles with notebook theme
  editForm: {
    padding: 12,
    backgroundColor: "rgba(255, 248, 220, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(173, 216, 230, 0.3)",
  },
  
  editInput: {
    borderWidth: 1,
    borderColor: "#ADD8E6",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Georgia",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  
  editCommentForm: {
    backgroundColor: "rgba(255, 248, 220, 0.2)",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(173, 216, 230, 0.4)",
  },
  
  // Comment styles with notebook theme
  commentForm: {
    margin: 12,
    padding: 15,
    backgroundColor: "rgba(255, 248, 220, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(173, 216, 230, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  commentInput: {
    borderWidth: 1,
    borderColor: "#ADD8E6",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: "top",
    marginBottom: 10,
    fontFamily: "Georgia",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  commentFormActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "rgba(220, 220, 220, 0.8)",
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  cancelButtonText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#4682B4", // Steel blue
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  
  submitButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  commentContainer: {
    margin: 10,
    padding: 12,
    backgroundColor: "rgba(248, 248, 255, 0.6)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(173, 216, 230, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  commentText: {
    fontSize: 13,
    color: "#2F4F4F",
    marginBottom: 8,
    fontFamily: "Georgia",
    lineHeight: 18,
  },
  
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  commentLeftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  
  commentRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  
  commentLikes: {
    fontSize: 11,
    color: "#8B4513",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  commentLikeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 248, 220, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(218, 165, 32, 0.3)",
  },
  
  commentLikeText: {
    fontSize: 11,
    color: "#4682B4",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  commentEditButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "rgba(135, 206, 250, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(135, 206, 250, 0.4)",
  },
  
  commentEditText: {
    fontSize: 11,
    color: "#1976d2",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  commentDeleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 182, 193, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 182, 193, 0.5)",
  },
  
  commentDeleteText: {
    fontSize: 11,
    color: "#dc143c",
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  
  comment: {
    backgroundColor: "#4682B4",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
});