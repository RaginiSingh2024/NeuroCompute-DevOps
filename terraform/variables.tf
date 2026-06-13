variable "region" {
  description = "AWS region"
  type = string
  default = "us-east-1"
}

variable "public_key_path" {
  description = "Path to public key for EC2"
  type = string
}
