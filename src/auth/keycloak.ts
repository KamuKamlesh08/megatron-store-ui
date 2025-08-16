import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "megatron",
  clientId: "megatron-ui",
});

export default keycloak;
