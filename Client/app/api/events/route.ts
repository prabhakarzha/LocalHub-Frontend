// client/app/api/events/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

// Mock event data
const mockEvents = [
  {
    id: "1",
    title: "Hyderabad Tech Summit 2023",
    date: "2023-12-15T09:00:00",
    location: "HITEX Convention Center, Hyderabad",
    price: "₹1500",
    image_url:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
    description:
      "Annual technology conference featuring the latest innovations in AI, Blockchain, and Cloud Computing.",
  },
  {
    id: "2",
    title: "Hyderabad Music Festival",
    date: "2023-12-20T18:00:00",
    location: "Gachibowli Stadium, Hyderabad",
    price: "₹2000",
    image_url:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500",
    description: "Live performances from top artists across various genres.",
  },
  {
    id: "3",
    title: "Startup Networking Meetup",
    date: "2023-12-10T14:00:00",
    location: "T-Hub, Hyderabad",
    price: "Free",
    image_url:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500",
    description:
      "Connect with fellow entrepreneurs and investors in the Hyderabad startup ecosystem.",
  },
  {
    id: "4",
    title: "Food & Wine Festival",
    date: "2023-12-17T11:00:00",
    location: "Jubilee Hills, Hyderabad",
    price: "₹1000",
    image_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500",
    description:
      "Experience the finest cuisine and wines from Hyderabad's top restaurants and vineyards.",
  },
  {
    id: "5",
    title: "Yoga & Wellness Workshop",
    date: "2023-12-08T06:00:00",
    location: "Banjara Hills, Hyderabad",
    price: "₹500",
    image_url:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
    description:
      "Beginner-friendly yoga session focusing on mindfulness and stress relief.",
  },
  {
    id: "6",
    title: "Art Exhibition: Modern Hyderabad",
    date: "2023-12-22T10:00:00",
    location: "Salar Jung Museum, Hyderabad",
    price: "₹300",
    image_url:
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=500",
    description:
      "Showcasing contemporary art from Hyderabad's emerging artists.",
  },
];

export async function GET() {
  try {
    console.log("🚀 Events API Route called - Attempting external API...");

    // First try the external API with a short timeout
    try {
      const externalResponse = await axios.get(
        "https://allevents.in/api/events?location=Hyderabad&apikey=3SCEXJQ7CRIXQSG55A",
        {
          timeout: 5000, // 5 second timeout for external API
          headers: {
            Accept: "application/json",
            "User-Agent": "NextJS-EventApp/1.0",
          },
        }
      );

      console.log("✅ External API Response:", externalResponse.status);

      // Handle different response structures from external API
      const events =
        externalResponse.data?.events ||
        externalResponse.data?.data ||
        externalResponse.data ||
        [];

      if (events.length > 0) {
        console.log(`📅 Found ${events.length} events from external API`);
        return NextResponse.json({
          events: Array.isArray(events) ? events : [],
          success: true,
          total: Array.isArray(events) ? events.length : 0,
          message: `Successfully fetched ${
            Array.isArray(events) ? events.length : 0
          } events from Hyderabad`,
        });
      }
    } catch (externalError: any) {
      console.log(
        "🌐 External API unavailable, using mock data:",
        externalError.message
      );
      // Continue to mock data fallback
    }

    // If external API fails or returns no events, use mock data
    console.log("📋 Using mock data instead");

    // Simulate a small delay to mimic network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(`📅 Returning ${mockEvents.length} mock events`);

    return NextResponse.json({
      events: mockEvents,
      success: true,
      total: mockEvents.length,
      message: `Successfully fetched ${mockEvents.length} events from Hyderabad (using demo data)`,
    });
  } catch (error: any) {
    console.error("❌ Events API Error:", error.message);

    // Even in case of unexpected errors, return mock data
    return NextResponse.json(
      {
        error: "Failed to fetch events: " + error.message,
        success: false,
        events: mockEvents,
        message: `Using demo data due to error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
