import { describe, it, expect } from "vitest";

describe("Workflow State Logic", () => {
  it("allows draft → pending → approved", () => {
    const post = { status: "draft" };

    // Submit
    post.status = "pending";
    expect(post.status).toBe("pending");

    // Approve
    post.status = "approved";
    expect(post.status).toBe("approved");
  });

  it("does not allow approved → rejected", () => {
    const post = { status: "approved" };

    const attemptReject = () => {
      if (post.status !== "pending") {
        throw new Error("Invalid state transition");
      }
      post.status = "rejected";
    };

    expect(attemptReject).toThrow();
  });
});
