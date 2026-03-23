terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "~> 2.0"
    }
  }

  required_version = ">= 1.0"
}

provider "scaleway" {
  region = var.region
  zone   = "${var.region}-1"
}

resource "scaleway_account_project" "main" {
  name        = "sebastian-heitmann-dev"
  description = "Personal portfolio website and supporting services"
}
