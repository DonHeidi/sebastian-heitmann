resource "scaleway_object_bucket" "rocks" {
  name       = "sebastian-heitmann-rocks"
  project_id = scaleway_account_project.main.id
}

resource "scaleway_object_bucket_acl" "rocks" {
  bucket     = scaleway_object_bucket.rocks.id
  acl        = "public-read"
  project_id = scaleway_account_project.main.id
}

resource "scaleway_object_bucket_website_configuration" "rocks" {
  bucket     = scaleway_object_bucket.rocks.name
  project_id = scaleway_account_project.main.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}
