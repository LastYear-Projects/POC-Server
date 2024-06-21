import userSchema from "../Schemas/userSchema";

const user = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "password123",
  userPreference: "points",
};

let testUser = { ...user };

describe("userSchema", () => {
  it("should validate a correct user", () => {
    const result = userSchema.safeParse(testUser);
    expect(result.success).toBe(true);
  });

  it("should validate a wrong user-numbers in the name", () => {
    testUser.firstName = "John1";
    const result = userSchema.safeParse(testUser);
    expect(result.success).toBe(false);
    testUser = { ...user };
  });

  it("should validate a wrong user-short name", () => {
    testUser.firstName = "J";
    const result = userSchema.safeParse(testUser);
    expect(result.success).toBe(false);
    testUser = { ...user };
  });

  it("should validate a wrong user-invalid email", () => {
    testUser.email = "john.doe";
    const result = userSchema.safeParse(testUser);
    expect(result.success).toBe(false);
    testUser = { ...user };
  });

  it("should validate a wrong user-short password", () => {
    testUser.password = "1234567";
    const result = userSchema.safeParse(testUser);
    expect(result.success).toBe(false);
    testUser = { ...user };
  });

  it("should validate a wrong user-invalid user preference", () => {
    testUser.userPreference = "points1";
    const result = userSchema.safeParse(testUser);
    expect(result.success).toBe(false);
    testUser = { ...user };
  });

  it("should validate a wrong user-missing field", () => {
    delete testUser.firstName;
    const result = userSchema.safeParse(testUser);
    expect(result.success).toBe(false);
    testUser = { ...user };
  });
});
