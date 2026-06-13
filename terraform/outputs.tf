output "instance_id" {
  value = aws_instance.app.id
}

output "vpc_id" {
  value = aws_vpc.main.id
}
