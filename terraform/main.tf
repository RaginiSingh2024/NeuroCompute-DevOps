resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "neuro-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "${var.region}a"
  tags = { Name = "neuro-public-subnet" }
}

resource "aws_security_group" "ssh_http" {
  name = "neuro-sg"
  vpc_id = aws_vpc.main.id
  ingress = [
    { from_port = 22, to_port = 22, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] },
    { from_port = 80, to_port = 80, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] },
    { from_port = 443, to_port = 443, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }
  ]
  egress = [{ from_port = 0, to_port = 0, protocol = "-1", cidr_blocks = ["0.0.0.0/0"] }]
}

resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0" # example
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deployer.key_name
  subnet_id     = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ssh_http.id]
  tags = { Name = "neuro-instance" }
}

resource "aws_key_pair" "deployer" {
  key_name   = "neuro-key"
  public_key = file(var.public_key_path)
}
