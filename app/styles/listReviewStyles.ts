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
    borderColor: "rgba(218, 165, 32, .1)",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderRadius: 4,
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
    backgroundColor: "rgba(218, 165, 32, .1)",
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
    backgroundColor: 'transparent', // Make sure it's transparent so lines show through
    zIndex: 2,
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
    fontSize: isSmallScreen ? 20 : 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2F4F4F",
    lineHeight: isSmallScreen ? 24 : 22,
    fontFamily: "Georgia",
    letterSpacing: 1,
    backgroundColor: 'transparent', // Ensure transparency
    zIndex: 3, // Higher z-index
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
    lineHeight: isSmallScreen ? 20 : 18,
    marginBottom: 8,
    fontFamily: "Georgia",
    fontStyle: "italic",
    backgroundColor: 'transparent', // Ensure transparency
    zIndex: 3, // Higher z-index
  },

  gridAuthor: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 8,
    color: "#696969",
    fontFamily: "Georgia",
    backgroundColor: 'transparent', // Ensure transparency
    zIndex: 3, // Higher z-index
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#fff8e1", // Soft, scrapbook-like paper yellow
    minWidth: 48,
    minHeight: 38,
    justifyContent: "center",
    margin: 4,
    borderWidth: 2,
    borderColor: "#e0b97f", // Warm tan border
    shadowColor: "#bfa77a",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
    // Add a little "tape" effect with a border style
    borderStyle: "dashed",
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
    borderRadius: 10,
    backgroundColor: "#f5f3f0",
    borderWidth: 2,
    borderColor: "#bfa77a",
    borderStyle: "dotted",
    shadowColor: "#bfa77a",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },

  cancelButtonText: {
    fontSize: 13,
    color: "#7d6a4d",
    fontWeight: "700",
    fontFamily: "Georgia",
    letterSpacing: 0.5,
  },

  submitButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f9e7d2", // Lighter scrapbook paper
    borderWidth: 1.5,
    borderColor: "#e0b97f",
    borderStyle: "dotted",
    shadowColor: "#bfa77a",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    
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
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff8e1",
    borderWidth: 1.5,
    borderColor: "#e0b97f",
    borderStyle: "dotted",
    marginRight: 4,
  },

  commentLikeText: {
    fontSize: 11,
    color: "#4682B4",
    fontWeight: "600",
    fontFamily: "Georgia",
  },

  commentEditButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#e3f2fd",
    borderWidth: 1.5,
    borderColor: "#90caf9",
    borderStyle: "dashed",
    marginRight: 4,
  },

  commentEditText: {
    fontSize: 11,
    color: "#1976d2",
    fontWeight: "600",
    fontFamily: "Georgia",
  },

  commentDeleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#ffd6d6",
    borderWidth: 1.5,
    borderColor: "#e57373",
    borderStyle: "dashed",
    marginRight: 4,
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
  // Add these styles to your listReviewStyles.ts file
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationDialog: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    minWidth: 280,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  confirmationMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmationCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmationDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmationCancelText: {
    color: "#7d6a4d",
    fontWeight: "700",
    fontFamily: "Georgia",
    fontSize: 14,
  },

  confirmationDeleteText: {
    color: "#b71c1c",
    fontWeight: "700",
    fontFamily: "Georgia",
    fontSize: 14,
  },
  // Horizontal lines across the paper
  showMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f9e7d2", // Lighter scrapbook paper
    borderWidth: 1.5,
    borderColor: "#e0b97f",
    borderStyle: "dotted",
    shadowColor: "#bfa77a",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  showMoreText: {
    fontSize: 12,
    color: "#b77b2b",
    fontWeight: "700",
    fontFamily: "Georgia",
    letterSpacing: 0.5,
  },


  // Three-hole punch effect
  holeContainer: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    width: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
  },

  hole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f5f3f0', // Same as container background
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },


  // Update your existing gridItem style
  gridItem: {
    flex: 1,
    margin: isSmallScreen ? 8 : 12,
    backgroundColor: "#fefefe",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
    width: isSmallScreen
      ? width - 32
      : isLargeScreen
        ? (width - 84) / 3
        : (width - 52) / 2,
    borderLeftWidth: 2,
    borderLeftColor: "#ff6b6b",
    paddingLeft: 45,
    position: "relative",
    minHeight: 500, // Ensure enough height for the effect
  },
});