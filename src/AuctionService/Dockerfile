# ==============================
# Base runtime image
# ==============================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Uncomment ONLY if APP_UID is guaranteed to exist
# USER $APP_UID

# ==============================
# Build stage
# ==============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj and restore (important for layer caching)
COPY ["src/AuctionService/AuctionService.csproj", "AuctionService/"]# vim think about it as I copy this file to this directory
RUN dotnet restore "AuctionService/AuctionService.csproj" # vip restore from csproj file

# Copy remaining source
COPY src/AuctionService/. AuctionService/
WORKDIR /src/AuctionService

RUN dotnet build -c $BUILD_CONFIGURATION -o /app/build #vip the / befor app is imortant it makes it an absolute path

# ==============================
# Publish stage
# ==============================
#vip every from starts a new stage 
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# ==============================
# Final runtime stage
# ==============================
FROM base AS final # vip from base means we are using the base image defined at the top
WORKDIR /app       # and we coppy the published output from bublish image to /app    
COPY --from=publish /app/publish . 
ENTRYPOINT ["dotnet", "AuctionService.dll"]
