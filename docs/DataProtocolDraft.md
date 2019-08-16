# A2R Data protocol

## Folder structure used by the protocol

- **/types/**:  Data types used by the API and Client
- **/api/**: Methods to be called by the client
- **/model/**:  Collections that are available

## Basic API Concept

Any function exported in any file under the API Folder will be processed by the framework as part of the public API of the application, generating a the *Client Proxy Code* that will allow the front to consume it in a isomorphic way.
