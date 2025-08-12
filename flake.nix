{
  description = "Dev environment with Bun";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux"; # change to "aarch64-darwin" for Apple Silicon
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.bun
        ];

        # Optional: set bun as default command when entering `nix develop`
        shellHook = ''
          echo "Bun $(bun --version) ready to go 🚀"
        '';
      };
    };
}

