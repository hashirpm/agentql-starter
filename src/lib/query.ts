export const LIST_QUERY = `
{
    restaurants []{
        name
        rating (rating number)
        number_of_reviews (number of reviews)
        tags[]
        description
        website (URL to the restaurant's website)
        related_links (related links to the restaurant)[]{
        link_name (name of the link)
        link (URL to the link)
        }
        features (features offered by the restaurant) []
        price_range (price range)
        tripadvisor_detailed_link (URL to the detailed information about the restaurant)
    }
}
`;

export const DETAILED_QUERY = `
{
    name
    address
    rating (rating number)
    total_reviews (total number of reviews recieved for this restaurant)
    review_summary (summary of the reviews)
    reviews (the reviews by each person)[]{
        reviewer (name of the person who reviewed)
        review (the description or the review)
        rating (number of rating given)
    }
    price_range (price range)   
    features (all features or aminities offered by the restaurant) []
    website (URL to the restaurant's website)
    location (URL to the restaurant's location)
    menu_link (URL to the restaurant's menu)
    booking_link (URL to the restaurant's booking page)
    description (description about the restaurant)
    tags[]
    perfect_for (occassions where this coffee shop is recommended or preferred) [] 
    contact_number
    email (email address of the restaurant)
    payment_methods[]
    drinks (drinks that are available at this coffee shop) []
    hours (operating hours for each day) []{
        day
        operating_hours
    }
    cover_image (URL to the restaurant's cover image)
    menu_items (menu items available at the restaurant) []{
    item_name (name of the menu item)
    review_count (number of reviews for the menu item)
    }
}
`;
